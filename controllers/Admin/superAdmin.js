import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HostelInfo from "../../models/hostelInfo.js";
import HostelAdmin from '../../models/hostelAdmin.js'

dotenv.config();


// login data
export const login = async (req, res, next) => {

  const { email, password } = req.body
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


// hostels requests
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

// hostel approval
export const approval = async (req, res, next) => {
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

// hostel rejection
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

// fetch hostels data
export const hostelData = async (req, res, next) => {
  try {
    const hostelData = await HostelInfo.find({})
      .populate({ path: 'adminData', select: 'email' })
      .select('_id hostelName isBlocked');
    res.status(200).json(hostelData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// block hostel
export const blockHostel = async (req, res, next) => {
  try {

    const id = req.params.id
    const adminId = req.params.adminId

    const hostelData = await HostelInfo.findOne({ _id: id });
    const adminData = await HostelAdmin.findOne({ _id: adminId })

    if (hostelData) {
      if (hostelData.isBlocked === false) {
        hostelData.isBlocked = true
        await hostelData.save();

        if (adminData) {
          if (adminData.isBlocked === false) {
            adminData.isBlocked = true
            await adminData.save()
          }

        }

        res.status(200).json({ message: 'Success' })
      }
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// unblock hostel
export const unblockHostel = async (req, res, next) => {
  try {

    const id = req.params.id
    const adminId = req.params.adminId

    const hostelData = await HostelInfo.findOne({ _id: id });
    const adminData = await HostelAdmin.findOne({ _id: adminId })

    if (hostelData) {
      if (hostelData.isBlocked === true) {
        hostelData.isBlocked = false
        await hostelData.save();

        if (adminData) {
          if (adminData.isBlocked === true) {
            adminData.isBlocked = false
            await adminData.save()
          }

        }

        res.status(200).json({ message: 'Success' })
      }
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

