import transporter from "../config/nodeMailer.js";
import Otp from "../models/otp.js";
import dotenv from 'dotenv'
dotenv.config()


export async function sendMail(email, fullName) {
    const OTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const otpData = { email, otp: OTP };
      const existingOtpDoc = await Otp.findOne({ email });
  
      if (existingOtpDoc) {
        await Otp.findByIdAndDelete(existingOtpDoc._id);
      }
      const newOtpDoc = new Otp(otpData);
      await newOtpDoc.save();
  
      const mailData = {
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: "Here is the OTP for registering with our HostelHive",
        text: `Dear ${fullName},\n\nYour One-Time Password (OTP) for registration is: ${OTP}\n\nPlease enter this OTP to complete your registration. This OTP is valid for 3 minutes.\n\nThank you,\nHostelHive Team`,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
          <h3 style="color: #2b56e3;">HostelHive Registration OTP</h3>
          <p>Dear ${fullName},</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #2b56e3;">${OTP}</p>
          <p>Please enter this OTP to complete your registration.</p>
          <p>This OTP is valid for 3 minutes.</p>
          <p>Thank you,</p>
          <p>HostelHive Team</p>
        </div>`,
      };
  
      const info = await transporter.sendMail(mailData);
    } catch (err) {
      console.log(err, "mailer error");
    }
  }