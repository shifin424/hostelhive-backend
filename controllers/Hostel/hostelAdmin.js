import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import HostelAdmin from "../../models/hostelAdmin.js";
import HostelInfo from "../../models/hostelInfo.js";
import HostelRooms from "../../models/hostelRoom.js";
import Student from '../../models/studentAuth.js'
import Menu from "../../models/menu.js";
import { sendOtp, verifyOtp } from "../../helpers/twilioOtp.js";
import Joi from "joi";
import Complaints from "../../models/complaints.js";
import LeaveLetter from "../../models/LeaveLetter.js";

dotenv.config();

// signup data
export const signUp = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      qualification,
      gender,
      confirmPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !password ||
      !qualification ||
      !gender ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const Schema = Joi.object({
      fullName: Joi.string()
        .required()
        .messages({ "any.required": "Required" }),
      password: Joi.string()
        .required()
        .messages({ "any.required": "Required" }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": "Invalid email address",
          "any.required": "Please enter your email",
        }),
      confirmPassword: Joi.string()
        .required()
        .messages({ "any.required": "Confirm Password is required" }),
      mobileNumber: Joi.number().required().messages({
        "number.any": "Required",
        "number.base": "Mobile Number is required",
        "number.length": "Mobile Number must be exactly 10 digits",
      }),
      qualification: Joi.string()
        .required()
        .messages({ "any.required": "Required" }),
      gender: Joi.string().required().messages({ "any.required": "Required" }),
    });

    const { error } = Schema.validate(
      {
        fullName,
        email,
        mobileNumber,
        password,
        qualification,
        gender,
        confirmPassword,
      },
      { abortEarly: true }
    );

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
    const adminExistByName = await HostelAdmin.findOne({ fullName });
    if (adminExistByName) {
      return res
        .status(400)
        .json({ message: "User with this name already exists" });
    }

    const adminExistsByEmail = await HostelAdmin.findOne({ email });
    if (adminExistsByEmail) {
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
    return res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// otp data
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

    //const otpVerify = await verifyOtp(mobileNumber, otpCode);
    // if (otpVerify.status == "approved") {
    if (otpCode) {
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

// login data
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const admin = await HostelAdmin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ message: "No User Found" });
    }
    if (admin.isBlocked === true) {
      res.status(400).json({ message: "Sorry, this user is currently blocked. Please contact the administrator for further assistance." })
    } else {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const payload = {
          id: admin.id,
          fullName: admin.fullName,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });

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
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// add hostels
export const addHostel = async (req, res, next) => {
  try {
    const Admin = req.user.id;
    const {
      title,
      location,
      description,
      hostelType,
      admissionFees,
      latitude,
      longitude,
    } = req.body;
    const { path, filename } = req.file;

    if (
      !title ||
      !location ||
      !description ||
      !hostelType ||
      !admissionFees ||
      !latitude ||
      !longitude ||
      !path ||
      !filename
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const schema = Joi.object({
      title: Joi.string().required().messages({
        "any.required": "Hostel Name is required",
      }),
      location: Joi.string().required().messages({
        "any.required": "Location is required",
      }),
      description: Joi.string()
        .required()
        .custom((value, helpers) => {
          const words = value.trim().split(/\s+/);
          if (words.length < 50) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .max(650)
        .messages({
          "any.required": "Description is required",
          "any.invalid": "Description must have at least 50 words",
          "string.max": "Description must have at most 90 words",
        }),
      path: Joi.string().required().messages({
        "any.required": "Image path is required",
      }),
      filename: Joi.string().required().messages({
        "any.required": "Image filename is required",
      }),
      hostelType: Joi.string().required().messages({
        "any.required": "Hostel Type is required",
      }),
      admissionFees: Joi.number().required().messages({
        "any.required": "Admission Fees is required",
      }),
    });

    const { error } = schema.validate(
      {
        title,
        location,
        description,
        hostelType,
        admissionFees,
        path,
        filename,
      },
      { abortEarly: true }
    );

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }

    const hostelAdmin = await HostelAdmin.findOne({ _id: Admin });
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

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// fetch hostel data
export const hostelData = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const hostelLists = await HostelInfo.find({ adminData: adminId }).select(
      "hostelName hostelImage.url isApproved"
    );
    res.status(200).json(hostelLists);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// hostel room data
export const roomData = async (req, res, next) => {
  try {
    const {
      roomNo,
      roomType,
      capacity,
      status,
      roomPrice,
      title,
      description,
    } = req.body;
    const { path, filename } = req.file;
    const hostelId = req.params.id;

    const hostel = await HostelInfo.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const existingRoom = await HostelRooms.findOne({
      room_no: roomNo,
      _id: { $in: hostel.rooms },
    });

    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const room = await HostelRooms.create({
      room_no: roomNo,
      room_type: roomType,
      capacity: capacity,
      status: status,
      room_rent: roomPrice,
      room_image: {
        public_id: filename,
        url: path,
      },
      description: description,
      title: title,
      blocking_rooms: false,
    });

    hostel.rooms.push(room._id);
    await hostel.save();

    res.status(200).json({ message: "Room created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// hostel edit room data
export const editRoomData = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    const hostel = await HostelInfo.findById(hostelId).populate('rooms');
    const rooms = hostel.rooms;

    res.status(200).json({ data: rooms })

  } catch (error) {
    res.status(500).json("Internal Server Error")
  }
}

// fetch room data
export const fetchRoomData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;

    const hostel = await HostelInfo.findById(hostelId).populate("rooms");
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    5
    const roomData = hostel.rooms.map((room) => ({
      _id: room._id,
      roomNo: room.room_no,
      roomType: room.room_type,
      capacity: room.capacity,
      status: room.status,
      description: room.description,
      title: room.title,
      roomImage: {
        publicId: room.room_image.public_id,
        url: room.room_image.url,
      },
      roomRent: room.room_rent,
    }));

    res.status(200).json(roomData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// hostel student data
export const studentRequestData = async (req, res, next) => {
  try {
    const hostelId = req?.params?.id
    const StudentRequestData = await Student.find({ hostelId, isRequested: true, isVerified: false, rejectedReason: 'none' })
      .select(" address _id fullName email gender phone ")
      .populate('hostelId', "hostelName")
    console.log(StudentRequestData, "backend data");

    res.status(200).json({ StudentRequestData })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// student hostel entry approval
export const approval = async (req, res, next) => {
  try {
    const id = req.params.id

    const studentData = await Student.findOne({ _id: id })
    if (studentData.isVerified === false) {
      studentData.isVerified = true;
      await studentData.save();

      const success = "Approved Student request Successfully";
      res.status(200).json({ message: success });
    } else {
      const success = "Already Student Reuest is  approved";
      res.status(200).json({ message: success });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// student entry rejection
export const rejected = async (req, res, next) => {
  try {
    const id = req.params.id;
    const description = req.body.description;

    const studentData = await Student.findOne({ _id: id });

    if (studentData.isVerified === false) {
      studentData.rejectedReason = description;
      await studentData.save();

      const success = 'Student Request has been Rejected';
      res.status(200).json({ message: success });
    } else {
      const success = 'student request is already is Rejected';
      res.status(200).json({ message: success });
    }

  } catch (err) {
    console.log(err);
    next(err);
  }
};

// fetch menu data
export const fetchFoodData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const foodData = await Menu.find({ hostelId });

    if (!foodData) {
      return res.status(404).json({ error: 'Menu data not found' });
    }

    res.status(200).json({ foodData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// adding menu
export const addFoodMenu = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    const { day, breakfast, lunch, snacks, dinner } = req.body.values
    const existingMenu = await Menu.findOne({ hostelId, day });

    if (existingMenu) {
      res.json({ error: "The day you entered already exists. Please choose a different day" })
    } else {
      const newMenu = new Menu({
        hostelId,
        day,
        breakfast,
        lunch,
        snacks,
        dinner,
      });
      await newMenu.save();
      res.status(200).json({ message: "Menu added successfully" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// edit menu
export const editMenu = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const { breakfast, lunch, snacks, dinner, day } = req.body.values;

    let existingMenu = await Menu.findOne({ hostelId, day });

    if (existingMenu) {

      existingMenu.breakfast = breakfast;
      existingMenu.lunch = lunch;
      existingMenu.snacks = snacks;
      existingMenu.dinner = dinner;
    } else {

      existingMenu = new Menu({
        hostelId,
        day,
        breakfast,
        lunch,
        snacks,
        dinner,
      });
    }

    await existingMenu.save();

    res.status(200).json({ message: 'Food menu updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// fetch student data
export const StudentData = async (req, res, next) => {
  try {

    const hostelId = req.params.id
    const hostelData = await Student.find({ hostelId }).select('isBlocked email fullName phone role')
    console.log(hostelData);

    if (!hostelData) {
      res.status(400).json({ message: "No matching Hostel Id found" })
    }

    res.status(200).json({ hostelData })

  } catch (error) {
    res.status(500).json({ error: "Internal server Error" })
  }
}

// student blocking
export const blockStudent = async (req, res, next) => {
  try {
    const userId = req.params.id

    const userData = await Student.findById(userId)

    if (!userData) {
      res.status(401).json({ message: "user not Found" })
    }
    if (userData.isVerified === true) {
      userData.isBlocked = true;
      await userData.save();

      const success = 'Student has been Blocked';
      res.status(200).json({ message: success });
    }

  } catch (error) {
    res.status(500).json({ error: "Internal server Error" })
  }
}

// unblock student data
export const unblockStudent = async (req, res, next) => {
  try {
    const userId = req.params.id
    const userData = await Student.findById(userId)
    if (!userData) {
      res.status(401).json({ message: "user not Found" })
    }
    if (userData.isVerified === true) {
      userData.isBlocked = false;
      await userData.save();
      const success = 'Student has been Blocked';
      res.status(200).json({ message: success });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" })
  }
}

// student data removal
export const deleteStudent = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = await Student.findById(userId);

    if (userData) {
      await Student.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server error' });
  }
};

// fetch complaint data
export const complaintsData = async (req, res, next) => {
  try {
  
    const hostelId = req.params.id
    const complaintDetails = await Complaints.find({ hostelId }).populate('user', 'fullName').select('_id complaintType complaintDescrption status  createdAt adminResponse complaintDescription')
    const formattedComplaints = complaintDetails.map(complaint => ({
      ...complaint.toObject(),
      createdAt: complaint.createdAt.toISOString().split('T')[0]
    }));

    res.status(200).json({ formattedComplaints })

  } catch (error) {
    res.status(400).json({ error: "Interal server error" })
  }
}

// edit complaint data
export const editComplaint = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const { status, adminResponse } = req.body.values;
    const complaintData = await Complaints.findOne({ _id: Id });

    if (!complaintData) {
      return res.status(400).json({ message: "No Data available" });
    }

    complaintData.status = status;
    complaintData.adminResponse = adminResponse;

    await complaintData.save();

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// student leave data
export const LeaveData = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    const LeaveData = await LeaveLetter.find({ hostelId }).select('startDate endDate description').exec()
    const LeaveDatas = LeaveData.map((leave) => ({
      ...leave.toObject(),
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
    }));
    res.status(200).json({ LeaveDatas })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' })
  }
}
