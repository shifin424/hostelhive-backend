import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HostelAdmin from "../models/hostelAdmin.js";
import { sendOtp, verifyOtp } from "../helpers/twilioOtp.js";

// export const siwsegnUp = async (req, res, next) => {
//   const data = req.body;

//   const password = data.password;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const existingAdmin = await hostelAdmin.findOne({ email: data.email });

//     if (existingAdmin) {
//       return res.status(409).json({ error: "Email already exists" });
//     }

//     const newHostelAdmin = new hostelAdmin({
//       email: data.email,
//       password: hashedPassword,
//       mobile: data.mobileNumber,
//       gender: data.gender,
//       qualificaton: data.qualification,
//       Address: [
//         {
//           landMark: data.landMark,
//           area: data.area,
//           state: data.state,
//         },
//       ],
//     });

//     await newHostelAdmin.save();
//     res.status(201).json({ message: "Signup successful" });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };

export const signUp = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      landMark,
      state,
      area,
      qualification,
      gender,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !password ||
      !landMark ||
      !state ||
      !area ||
      !qualification ||
      !gender
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const adminExistsByEmail = await HostelAdmin.findOne({ email });
    if (adminExistsByEmail) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

  
    const adminExistsByMobile = await HostelAdmin.findOne({ mobile:mobileNumber });
    if (adminExistsByMobile) {
      return res.status(400).json({ error: "User with this mobile number already exists" });
    }
    

    const otpSend = await sendOtp(mobileNumber);
    if (!otpSend) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    // Create a JSON object containing all the data
    const responseData = {
      fullName,
      email,
      mobileNumber,
      password,
      landMark,
      state,
      area,
      qualification,
      gender,
    };

    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
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
      landMark,
      state,
      area,
      qualification,
      gender,
      otpCode,
    } = req.body;
    
    const otpVerify = await verifyOtp(mobileNumber, otpCode);
    if (otpVerify.status == "approved") {
      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create User
      const hostelAdmin = await HostelAdmin.create({
        fullName,
        email,
        mobile: mobileNumber,
        landMark,
        state,
        area,
        qualification,
        gender,
        password: hashedPassword,
      });
      if (hostelAdmin) {
        res.status(201).json({
          _id: hostelAdmin.id,
          fullName: hostelAdmin.name,
          email: hostelAdmin.email,
          mobileNumber: hostelAdmin.mobileNumber,
          landMark: hostelAdmin.landMark,
          state: hostelAdmin.state,
          area: hostelAdmin.area,
          qualification: hostelAdmin.qualification,
          gender: hostelAdmin.gender,
        });
      }
    } else {
      res.status(401).json({message: "Invalid otp"})
    }
  } catch (error) {
    console.log(error);
    res.status(408).send({ message: "Internal Server Error" });
  }
};
