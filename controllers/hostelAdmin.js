import mongoose from "mongoose";
import bcrypt from "bcrypt";
import hostelAdmin from "../models/hostelAdmin.js";
import { sendOtp,verifyOtp } from "../helpers/twilioOtp.js";









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
//       qualificaton: data.qualificaion,
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
    try{

        const { fullName, email, mobileNumber, password,landMark,state,area,qualificaion,gender } = req.body;
        console.log(req.body)

        if (!fullName || !email || !mobileNumber || !password || !landMark ||!state || !area || !qualificaion || !gender) {
            return res.status(400).json({ error: 'Please provide all required fields' });
          }

          const AdminExists = await hostelAdmin.findOne({ email });
      if (AdminExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const otpSend = await sendOtp(mobileNumber);
      if (!otpSend) {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
      return res.status(200).json({ success: true });
      


    }catch (err) {
        next(err);
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
}



  
  
  
  
  export const otpVerification = async (req,res) => {
    try {

    const { fullName, email, mobileNumber, password,landMark,state,area,qualificaion,gender } = req.body;
    
    const otpVerify = await verifyOtp(mobileNumber, otpCode)
    if (otpVerify.status == 'approved') {
  
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
  
          // Create User
        const hostelAdmin = await User.create({
        fullName,email,mobileNumber,landMark,state,area,qualificaion,gender,
        password: hashedPassword
    })
    if(hostelAdmin) {  
        res.status(201).json({
            _id: hostelAdmin.id,
            fullName: hostelAdmin.name,
            email: hostelAdmin.email,
            mobileNumber: hostelAdmin.mobileNumber,
            landMark:hostelAdmin.landMark,
            state:hostelAdmin.state,
            area:hostelAdmin.area,
            qualificaion:hostelAdmin.qualificaion,
            gender:hostelAdmin.gender
        })
    }
    }else{
        res.status(400)
        throw new Error('Invalid OTP')
    }
    }catch (error) {
        res.status(408).send({message: "Internal Server Error"}) 
    }
  }




