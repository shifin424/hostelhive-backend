import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import HostelAdmin from "../models/hostelAdmin.js";
import HostelInfo from "../models/hostelInfo.js";
import HostelRooms from "../models/hostelroom.js";
import { sendOtp, verifyOtp } from "../helpers/twilioOtp.js";

dotenv.config();

export const signUp = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, qualification, gender } =
      req.body;
    console.log(fullName, "heyyyyyyyyy");

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

    const otpSend = await sendOtp(mobileNumber);
    if (!otpSend) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    const token = jwt.sign(
      { email, mobileNumber },
      process.env.OTP_JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    const responseData = {
      fullName,
      email,
      mobileNumber,
      password,
      qualification,
      gender,
      token,
    };

    return res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
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

    console.log(decoded, "checked");

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

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const hostelAdmin = await HostelAdmin.create({
        fullName,
        email,
        mobile: mobileNumber,
        qualification,
        gender,
        password: hashedPassword,
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
  console.log(email, password);

  try {
    const admin = await HostelAdmin.findOne({ email: email });

    if (!admin) {
      return res.status(404).json({ message: "No User Found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

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
    console.log("reached inside the controller");
    const Admin = JSON.parse(req.headers.authorization);
    const { title, location, description, latitude, longitude } = req.body;
    const { path, filename } = req.file;

    const hostelAdmin = await HostelAdmin.findOne({ _id: Admin.id });

    const existingHostel = await HostelInfo.findOne({ hostelName: title });
    if (existingHostel) {
      return res.status(400).json({ message: "Hostel name already exists" });
    }

    const newHostelInfo = await HostelInfo({
      hostelName: title,
      lat: latitude,
      lng: longitude,
      description: description,
      location: location,
      hostelImage: {
        public_id: filename,
        url: path,
      },
      adminData: Admin.id,
    });

    const savedHostelInfo = await newHostelInfo.save();

    hostelAdmin.hosteldata.push({
      hostelId: savedHostelInfo._id,
      hostelName: savedHostelInfo.hostelName,
    });
    await hostelAdmin.save();

    console.log(hostelAdmin, "=================");

    res.status(200).json({ message: "success", hostelAdmin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const hostelData = async (req, res, next) => {
  try {
    const data = JSON.parse(req.headers.authorization);
    const adminId = data.id;
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
    const { roomNo, roomType, capacity, status, roomPrice, url, public_id } = req.body;
    const hostelId = req.params.id;

    const existingRoom = await HostelRooms.findOne({ room_no: roomNo });

    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await HostelRooms.create({
      room_no: roomNo,
      room_type: roomType,
      occupants: capacity,
      status: status,
      room_rent:roomPrice,
      room_image: {
        public_id: public_id,
        url: url
      },
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
      roomNo: room.room_no,
      roomType: room.room_type,
      capacity: room.occupants,
      status: room.status
    }));

    res.status(200).json(roomData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


