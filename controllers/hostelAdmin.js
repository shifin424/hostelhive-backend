import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import HostelAdmin from "../models/hostelAdmin.js";
import { sendOtp, verifyOtp } from "../helpers/twilioOtp.js";
import jwt from "jsonwebtoken";

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

    const adminExistsByEmail = await HostelAdmin.findOne({ email });
    if (adminExistsByEmail) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    console.log(mobileNumber);
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
      // if (otpCode == 123456) {
      // Hash Password

      const adminExistsByEmail = await HostelAdmin.findOne({ email });
      if (adminExistsByEmail) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      console.log(mobileNumber);
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
          fullName: hostelAdmin.name,
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
    console.log(admin);
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
  console.log(req.body)
}
