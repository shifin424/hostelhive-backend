import mongoose from "mongoose";
import HostelAdmin from "../../models/hostelAdmin.js";
import HostelInfo from "../../models/hostelInfo.js";
import Student from "../../models/studentAuth.js";
import bcrypt from "bcryptjs";
import Joi from 'joi';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import {sendMail} from '../../helpers/mailer.js'
import Otp from "../../models/otp.js";


dotenv.config()


//fetch hostel data
export const hostelData = async (req, res, next) => {
  try {
    const hostelListing = await HostelInfo.find({ isApproved: "Approved", isBlocked: false }).select('hostelImage.url hostelName location')
    res.status(200).json(hostelListing)
  } catch (err) {
    console.log(err);
  }
}

// get single hostel data
export const singleHostelView = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    const result = await HostelInfo.findOne({ _id: hostelId, isApproved: "Approved" })
      .populate({
        path: "rooms",
        select: "title room_type room_image.url",
      })
      .populate({
        path: "adminData",
        select: "fullName mobile email",
      })
      .select("hostelName hostelImage description location adminData hostelType admissionFees");

    const rooms = {};

    result.rooms.forEach((room) => {
      if (room.room_type in rooms) {
        rooms[room.room_type].count++;
      } else {
        rooms[room.room_type] = {
          count: 1,
          room_image: room.room_image?.url || null,
        };
      }
    });

    const data = {
      ...result.toObject(),
      rooms: Object.entries(rooms).map(([room_type, { count, room_image }]) => ({
        room_type,
        count,
        room_image,
      })),
    };
    res.json(data);
  } catch (err) {
    console.log(err,"cout err");
    res.status(200).json({ err: 'Internal server error' })
  }
};

// fetch room data
export const fetchRoomData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const { room_type } = req.body;
    const hostel = await HostelInfo.findById(hostelId).populate({
      path: 'rooms',
      match: { room_type },
      select: 'room_image.url room_rent title description occupants capacity',
    });

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    const roomData = hostel?.rooms?.map(room => ({
      _id: room._id,
      url: room.room_image.url,
      rent: room.room_rent,
      title: room.title,
      description: room.description,
      occupants: room.occupants,
      capacity: room.capacity
    }));
    res.json({ roomData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch room data' });
  }
};

// singup data
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, phone, gender, password, confirmPassword } = req.body

    const schema = Joi.object({
      fullName: Joi.string().required().messages({
        'any.required': 'fullName is required',
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          'string.email': 'Invalid Email Format',
          'any.required': 'Email is required',
        }),
      phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          'string.length': 'Phone Number must be 10 digits',
          'string.pattern.base': 'Phone Number must be numeric',
          'any.required': 'Phone Number is required',
        }),
      gender: Joi.string().required().messages({
        'any.required': 'Gender is required',
      }),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          'string.pattern.base':
            'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
          'any.required': 'Password is required',
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({ 'any.only': "Passwords don't match", 'any.required': 'Confirm Password is required' }),
    });

    const { error } = schema.validate({ fullName, email, phone, gender, password, confirmPassword }, { abortEarly: true });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
    const isExist = await Student.findOne({
      $or: [
        { fullname: fullName },
        { phone: phone },
        { email: email }
      ]
    });
    if (isExist) {
    return  res.status(400).json({ error: "User with this name, phone, or email already exists" });
    }
  
     await sendMail(email,fullName)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const AuthData = {
      fullName,
      password: hashedPassword,
      phone,
      gender,
      email,
    };
    res.status(200).json({ response: AuthData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// otp data 
export const OtpVerification = async (req, res, next) => {
  try {
    const { fullName, email, phone, gender, password ,otp} = req.body
    console.log(fullName,email,phone,gender,password,otp);
    const schema = Joi.object({
      fullName: Joi.string().required().messages({
        'any.required': 'fullName is required',
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          'string.email': 'Invalid Email Format',
          'any.required': 'Email is required',
        }),
      phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          'string.length': 'Phone Number must be 10 digits',
          'string.pattern.base': 'Phone Number must be numeric',
          'any.required': 'Phone Number is required',
        }),
      gender: Joi.string().required().messages({
        'any.required': 'Gender is required',
      }),
      password: Joi.string()
        .required()
        .messages({
          'any.required': 'Password is required',
        })
    });
    const { error } = schema.validate({ fullName, email, phone, gender, password }, { abortEarly: true });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }

      if (!/^\d{6}$/.test(otp)) {
       res.status(400).json({ error: 'Invalid OTP format' });
    }

    // const savedOtp = await Otp.findOne({ email });

    // if (!savedOtp) {
    //   return res.status(400).json({ error: 'OTP not found. Please request a new OTP.' });
    // }
    

    // if (savedOtp.otp !== otp) {
    //   return res.status(400).json({ error: 'Invalid OTP. Please enter the correct OTP.' });
    // }
  

    const StudentAuth = await Student.create({
      fullName,
      email,
      phone,
      password,
      gender,
    });

    await Otp.deleteOne({ email });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.log(err);
  }
}

// login data
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const student = await Student.findOne({ email: email });

    if (!student) {
      return res.status(404).json({ message: "The user with the email does not exist" });
    }
    if (student?.isBlocked === true) {
      res.status(400).json({ message: "Sorry, this user is currently blocked. Please contact the administrator for further assistance. " })
    } else {

      const isMatch = await bcrypt.compare(password, student.password);
      if (isMatch) {
        const payload = {
          id: student.id,
          fullName: student.fullName,
        };

        const token = jwt.sign(payload, process.env.USER_SECRET_KEY, {
          expiresIn: "7d",
        });

        res.json({
          success: true,
          id: student.id,
          name: student.fullName,
          token: `Bearer ${token}`,
          role: student.role
        });

      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    }
  } catch (err) {
    console.error("Error occurred during login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}






