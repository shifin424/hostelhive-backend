import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import HostelAdmin from "../models/hostelAdmin.js";
import HostelInfo from "../models/hostelInfo.js";
import HostelRooms from "../models/hostelroom.js";
import { sendOtp, verifyOtp } from "../helpers/twilioOtp.js";
import Joi from "joi";

dotenv.config();

export const signUp = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, qualification, gender } =
      req.body;
    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !password ||
      !qualification ||
      !gender
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const adminExistByName = await HostelAdmin.findOne({fullName})
    if(adminExistByName){
      return res.status(400).json({message:"User with this name already exists"})
    }

    const adminExistsByEmail = await HostelAdmin.findOne({ email });
    if (adminExistsByEmail) {
      console.log("backend")
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const adminExistsByMobile = await HostelAdmin.findOne({
      mobile: mobileNumber,
    });
    if (adminExistsByMobile) {
      return res
        .status(400)
        .json({ message: "User with this mobile number already exists" });
    }

    // const otpSend = await sendOtp(mobileNumber);
    // if (!otpSend) {
    //   return res.status(500).json({ error: "Failed to send OTP" });
    // }

    const token = jwt.sign(
      { email, mobileNumber },
      process.env.OTP_JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const responseData = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      qualification,
      gender,
      token,
    };

    console.log(responseData, "data");
    return res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const otpVerification = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      qualification,
      gender,
      otpCode,
      token,
    } = req.body;

    const decoded = jwt.verify(token, process.env.OTP_JWT_SECRET);


    if (!decoded.email || !decoded.mobileNumber) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otpVerify = await verifyOtp(mobileNumber, otpCode);
    if (otpVerify.status == "approved") {
      const adminExistsByEmail = await HostelAdmin.findOne({ email });
      if (adminExistsByEmail) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const adminExistsByMobile = await HostelAdmin.findOne({
        mobile: mobileNumber,
      });

      if (adminExistsByMobile) {
        return res
          .status(400)
          .json({ error: "User with this mobile number already exists" });
      }

      

      const hostelAdmin = await HostelAdmin.create({
        fullName,
        email,
        mobile: mobileNumber,
        qualification,
        gender,
        password,
      });
      if (hostelAdmin) {
        res.status(201).json({
          _id: hostelAdmin.id,
          fullName: hostelAdmin.fullName,
          email: hostelAdmin.email,
          mobileNumber: hostelAdmin.mobileNumber,
          qualification: hostelAdmin.qualification,
          gender: hostelAdmin.gender,
        });
      }
    } else {
      res.status(401).json({ message: "Invalid otp" });
    }
  } catch (error) {
    console.log(error);
    res.status(408).send({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await HostelAdmin.findOne({ email: email });

    if (!admin) {
      return res.status(404).json({ message: "No User Found" });
    }
    console.log(admin.password);
    console.log(password + "");
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch);
    if (isMatch) {
      const payload = {
        id: admin.id,
        fullName: admin.fullName,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      console.log(token, 1);

      res.json({
        success: true,
        id: admin.id,
        name: admin.fullName,
        email: admin.email,
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addHostel = async (req, res, next) => {
  try {
    const Admin = req.user.id;
    const { title, location, description, hostelType, admissionFees, latitude, longitude } = req.body;
    const { path, filename } = req.file;

    const schema = Joi.object({
      title: Joi.string().required().messages({
        'any.required': 'Hostel Name is required',
      }),
      location: Joi.string().required().messages({
        'any.required': 'Location is required',
      }),
      description: Joi.string()
      .required()
      .custom((value, helpers) => {
        const words = value.trim().split(/\s+/);
        if (words.length < 50) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .max(650)
      .messages({
        'any.required': 'Description is required',
        'any.invalid': 'Description must have at least 50 words',
        'string.max': 'Description must have at most 90 words',
      }),    
      path: Joi.string().required().messages({
        'any.required': 'Image path is required',
      }),
      filename: Joi.string().required().messages({
        'any.required': 'Image filename is required',
      }),
      hostelType: Joi.string().required().messages({
        'any.required': 'Hostel Type is required',
      }),
      admissionFees: Joi.number().required().messages({
        'any.required': 'Admission Fees is required',
      }),
    });

    const { error } = schema.validate(
      { title, location, description, hostelType, admissionFees, path, filename },
      { abortEarly: true }
    );

    if (error) {
      console.log(error, "spotted");
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
    

    const hostelAdmin = await HostelAdmin.findOne({ _id: Admin });

    console.log(hostelAdmin,1);
    
    const existingHostel = await HostelInfo.findOne({ hostelName: title });
    if (existingHostel) {
      return res.status(400).json({ message: 'Hostel name already exists' });
    }

    const newHostelInfo = await HostelInfo({
      hostelName: title,
      lat: latitude,
      lng: longitude,
      description: description,
      location: location,
      hostelType: hostelType,
      admissionFees: admissionFees,
      hostelImage: {
        public_id: filename,
        url: path,
      },
      adminData: Admin,
    });

    const savedHostelInfo = await newHostelInfo.save();

    hostelAdmin.hosteldata.push({
      hostelId: savedHostelInfo._id,
      hostelName: savedHostelInfo.hostelName,
    });
    await hostelAdmin.save();

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const hostelData = async (req, res, next) => {
  try {

    console.log(req.user);
    const adminId = req.user.id;
    const hostelLists = await HostelInfo.find({ adminData: adminId })
      .select('hostelName hostelImage.url isApproved')
    res.status(200).json(hostelLists);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const roomData = async (req, res, next) => {
  try {


    const { roomNo, roomType, capacity, status, roomPrice, title, description } = req.body;
    const { path, filename } = req.file;
    const hostelId = req.params.id;

    const existingRoom = await HostelRooms.findOne({ room_no: roomNo });

    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await HostelRooms.create({
      room_no: roomNo,
      room_type: roomType,
      capacity: capacity,
      status: status,
      room_rent: roomPrice,
      room_image: {
        public_id: filename,
        url: path
      },
      description: description,
      title: title,
      blocking_rooms: false
    });

    const hostel = await HostelInfo.findById(hostelId);
    console.log(hostel);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    hostel.rooms.push(room._id);
    await hostel.save();

    res.status(200).json({ message: 'Room created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const fetchRoomData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;

    const hostel = await HostelInfo.findById(hostelId).populate('rooms');
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    const roomData = hostel.rooms.map(room => ({
      _id: room._id,
      roomNo: room.room_no,
      roomType: room.room_type,
      capacity: room.capacity,
      status: room.status,
      description: room.description,
      title: room.title,
      roomImage: {
        publicId: room.room_image.public_id,
        url: room.room_image.url
      },
      roomRent: room.room_rent,
    }));

    res.status(200).json(roomData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


