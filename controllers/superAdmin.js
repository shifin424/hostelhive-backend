import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HostelInfo from "../models/hostelInfo.js";
import HostelAdmin from '../models/hostelAdmin.js'

dotenv.config();



export const login = async (req, res, next) => {
  console.log(req.body)
  console.log("reached inside function")

  const email = req.body.email;
  const password = req.body.password;
  if (process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
    const payload = {
      email: email,
    };
    jwt.sign(
      payload,
      process.env.ADMIN_SECRET,
      {
        expiresIn: 3600000,
      },
      
      (err, token) => {
        if (err) console.error("Errors in Token generating");
      
        else {
          console.log(token,"this is the token")
          res.json({
            status: true,
            email: email,
            token: `Bearer ${token}`,
          });
        }
      }
    );
  } else {
    const error = "Incorrect email or password";
    res.json({ errors: error });
  }
};




export const requests = async (req, res, next) => {
  try {
    const result = await HostelInfo.find({ isApproved: 'Pending' })
      .populate({
        path: "adminData",
        select: "fullName mobile email",
      })
      .select("hostelName hostelImage location description adminData");
    res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};




export const approval = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const Id = req.params.id.trim();

    const hostelData = await HostelInfo.findOne({ _id: Id });

    if (hostelData.isApproved === 'Pending') {
      hostelData.isApproved = 'Approved';
      await hostelData.save();

      const success = "Hostel approved";
      res.status(200).json({ message: success });
    } else {
      const success = "Hostel is already approved";
      res.status(200).json({ message: success });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const rejected = async (req, res, next) => {
  try {
     const id = req.params.id;
     const description = req.body.description;

     const hostelData = await HostelInfo.findOne({ _id: id });

    if (hostelData.isApproved === 'Pending') {
      hostelData.isApproved = 'Rejected';
      hostelData.rejectedReason = description; 
      await hostelData.save();

      const success = 'Hostel Rejected';
      res.status(200).json({ message: success });
    } else {
      const success = 'Hostel is already Rejected';
      res.status(200).json({ message: success });
    }

  } catch (err) {
    console.log(err);
    next(err);
  }
};

