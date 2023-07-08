import mongoose from "mongoose";
import Students from '../../models/studentAuth.js'
import HostelInfo from "../../models/hostelInfo.js";
import HostelRooms from '../../models/hostelroom.js';
import Payment from "../../models/payement.js";
import Student from "../../models/studentAuth.js";
import Complaints from '../../models/complaints.js'
import LeaveLetter from '../../models/LeaveLetter.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import Razorpay from 'razorpay'
import Menu from "../../models/menu.js";
dotenv.config()


export const request = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    const userData = req.body;
    const id = req.params.hostelId
    console.log(id);

    const hostel = await HostelInfo.findOne({ rooms: roomId });
    if (!hostel) {
      return res.status(404).json({ error: 'Room with Hostel is not found' });
    }

    const student = await Students.findOne({ _id: userId }, { gender: 1 });
    const studentGender = student.gender
    const hostelType = hostel.hostelType


    if (hostelType !== 'all') {
      if (
        (studentGender === 'female' && hostelType === 'boys') ||
        (studentGender === 'male' && hostelType === 'girls')
      ) {
        console.log("Before sending 400 res")
        return res.status(400).json({
          message: `This hostel is not suitable for ${studentGender} students.`,
        });
      }
    }


    const user = await Students.findByIdAndUpdate(userId, {
      $set: {
        dateOfBirth: userData.dateOfBirth,
        bloodGroup: userData.bloodGroup,
        'address.houseName': userData.houseName,
        'address.city': userData.city,
        'address.area': userData.area,
        'address.landMark': userData.landmark,
        'address.pincode': userData.pincode,
        'address.country': userData.country,
        isRequested: true,
        hostelId: id
      },
    });
    res.status(200).json({ message: "success" })
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};


export const BookingData = async (req, res, next) => {
  try {
    const studentId = req.user.id
    const bookingStatus = await Students.find({ _id: studentId }).select('isRequested isVerified hostelId')

    res.status(200).json({ bookingStatus })
  } catch (err) {
    res.status(400).json({ error: "Internal Server Error" })
  }
}

export const fetchPaymentData = async (req, res, next) => {
  try {
    const roomId = req.params.id

    const roomDetails = await HostelRooms.findById(roomId)
    const hostelDetails = await HostelInfo.findOne({ 'rooms': roomId }).populate('rooms')


    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const monthlyRent = roomDetails.room_rent
    const admitFee = hostelDetails.admissionFees
    const daysRemainingInMonth = daysInMonth - now.getDate() + 1;
    const rentPerDay = roomDetails.room_rent / daysInMonth;
    const dynamicRent = Math.round(rentPerDay * daysRemainingInMonth);
    const totalRent = dynamicRent + hostelDetails.admissionFees

    res.status(200).json({ dynamicRent, totalRent, monthlyRent, admitFee })
  } catch (err) {
    console.log("error reaches here");
    res.status(500).json({ message: "Internal Server Error" })
  }
}



export const payMentDatas = async (req, res, next) => {
  try {
    const { order_id, amount, currency, payment_capture } = req.body;
    console.log(order_id, amount, currency, payment_capture);

    console.log("data", req.body);
    const razorpayInstance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRETS,
    });
    console.log(process.env.KEY_ID, process.env.KEY_SECRETS, "<<<<<<<<<<");

    const option = {
      receipt: order_id,
      amount: amount * 100,
      currency: "INR",
      payment_capture: payment_capture
    }
    const order = await razorpayInstance.orders.create(option);
    if (!order) return res.status(500).send("somthing error")

    res.status(200).json({ success: true, data: order });


  } catch (error) {
    console.log(error);
  }
}


export const paymentVerification = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const razorpayInstance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRETS,
    });

    const { orderId, rentPayment } = req.body;
    const roomId = rentPayment.room_id;

    const order = await razorpayInstance.orders.fetch(orderId);

    if (!order) {
      return res.status(500).send("Something went wrong");
    }

    if (order.status === "paid") {
      console.log("Payment success");

      const room = await HostelRooms.findById(roomId);
      if (room) {
        room.occupants += 1;
        await room.save();
      }

      const newPayment = new Payment({
        student: userId,
        rentAmount: rentPayment.rentAmount,
        monthOfPayment: rentPayment.monthOfPayment,
      });

      newPayment.save()
        .then(async (data) => {
          const hostel = await HostelInfo.findOne({ rooms: roomId }).populate('adminData');
          if (hostel) {
            const admin = hostel.adminData;
            admin.walletTotal += rentPayment.rentAmount;
            await admin.save();
          }

          const student = await Student.findById(userId);
          if (student) {
            student.role = "resident";
            await student.save();

            const payload = {
              id: student.id,
              name: student.fullName,
              role: student.role,
            };
            const token = jwt.sign(payload, process.env.USER_SECRET_KEY, {
              expiresIn: "3d",
            });

            const tokenData = {
              id: student.id,
              name: student.fullName,
              token: `Bearer ${token}`,
              role: student.role,
            };

            res.status(200).json({ success: true, data: { order, tokenData } });
          } else {
            res.json({ status: false, message: "Student not found" });
          }
        })
        .catch(() => {
          res.json({ status: false, message: "Order not placed" });
        });
    }
  } catch (error) {
    next(error);
  }
};

export const studentComplaint = async (req, res, next) => {
  try {
    const { complaintType, complaintDescription } = req.body.values;
    const hostelId = req.params.id;
    const userId = req.user.id;

    const complaint = new Complaints({
      hostelId,
      complaintType,
      complaintDescription,
      user: userId,
    });

    await complaint.save();

    res.status(200).json({ message: "Complaint saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const complaintData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const userId = req.user.id;

    const complaints = await Complaints.find({ hostelId, user: userId }).select('_id complaintType complaintDescription status adminResponse createdAt')
    console.log(complaints);

    const formattedComplaints = complaints.map(complaint => ({
      ...complaint.toObject(),
      createdAt: complaint.createdAt.toISOString().split('T')[0]
    }));

    res.status(200).json({ data: formattedComplaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const foodMenu = async (req, res, next) => {
  try {

    const hostelId = req.params.id

    const menuData = await Menu.find({ hostelId })

    if (!menuData) {
      res.status(400).json({ message: "Empty Food Data" })
    } else {
      res.status(200).json({ menuData })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const leaveLetter = async (req, res, next) => {
  try {
    const { startDate, endDate, description } = req.body.values;
    const userId = req.user.id;
    const hostelId = req.params.id;

    const leaveLetter = new LeaveLetter({
      hostelId,
      startDate,
      endDate,
      description,
      user: userId,
    });

    await leaveLetter.save();

    res.status(200).json({
      id: leaveLetter._id,
      startDate: leaveLetter.startDate,
      endDate: leaveLetter.endDate,
      description: leaveLetter.description,
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const fetchLeaveData = async ( req,res,next)=>{
  try{
    console.log(req.params.id)
    const hostelId = req.params.id

    const LeaveData = await LeaveLetter.find({hostelId}).select('startDate endDate description').exec()

    const LeaveDatas = LeaveData.map((leave) => ({
      ...leave.toObject(),
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
    }));


    res.status(200).json({LeaveDatas})
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}
