import mongoose from "mongoose";
import cron from 'node-cron'
import RentInfo from "../../models/RentInfo.js";
import Students from '../../models/studentAuth.js'
import HostelInfo from "../../models/hostelInfo.js";
import HostelRooms from '../../models/hostelRoom.js';
import Payment from "../../models/payement.js";
import Student from "../../models/studentAuth.js";
import Complaints from '../../models/complaints.js'
import VacatingLetter from '../../models/vacatingLetter.js'
import LeaveLetter from '../../models/LeaveLetter.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import Razorpay from 'razorpay'
import Menu from "../../models/menu.js";
dotenv.config()


// student hostel verificaion data
export const request = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    const userData = req.body;
    const id = req.params.hostelId
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

// fetch booking data
export const BookingData = async (req, res, next) => {
  try {
    const studentId = req.user.id
    const bookingStatus = await Students.find({ _id: studentId }).select('isRequested isVerified hostelId')

    res.status(200).json({ bookingStatus })
  } catch (err) {
    res.status(400).json({ error: "Internal Server Error" })
  }
}

// fetch payment data
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

// student payment verificaion 
export const payMentDatas = async (req, res, next) => {
  try {
    const { order_id, amount, currency, payment_capture } = req.body;
    const razorpayInstance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRETS,
    });
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

// payment conifrimation
export const paymentVerification = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const hostelId = req.params.id
    console.log(hostelId, "checking hostel Id");

    const razorpayInstance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRETS,
    });

    const { orderId, rentPayment } = req.body;
    console.log(rentPayment, "checking room data");
    const roomId = rentPayment.room_id;
    console.log(roomId, "room Id");

    const order = await razorpayInstance.orders.fetch(orderId);

    if (!order) {
      return res.status(500).send("Something went wrong");
    }

    if (order.status === "paid") {
      const room = await HostelRooms.findById(roomId);
      if (room) {
        room.occupants += 1;
        await room.save();
      }


      const newPayment = new Payment({
        student: userId,
        rentAmount: rentPayment.rentAmount,
        monthOfPayment: rentPayment.monthOfPayment,
        hostelId: hostelId
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
            student.roomData = roomId;
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


// student complaint dat
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

// fetch complaint data
export const complaintData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const userId = req.user.id;

    const complaints = await Complaints.find({ hostelId, user: userId }).select('_id complaintType complaintDescription status adminResponse createdAt')
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

// fetch menu data
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

// leave data
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

// fetch leave data
export const fetchLeaveData = async (req, res, next) => {
  try {
    console.log(req.params.id)
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
    res.status(500).json({ error: "Internal server error" })
  }
}

// fetch rent History
export const rentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const hostelId = req.params.id;
    console.log(userId);
    console.log(hostelId);

    const rentData = await Payment.find({
      student: userId,
      hostelId: hostelId
    }).populate('student', 'fullName');

    const formattedRentData = rentData.map(rent => ({
      ...rent.toObject(),
      createdAt: rent.createdAt.toISOString().split('T')[0]
    }));

    res.status(200).json({ rentData: formattedRentData });
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
};

//fetch rent due data
export const rentDueData = async (req, res, next) => {
  try {
    const userId = req.user.id
    const RentData = await RentInfo.find({ userId })

    const formattedRentData = RentData.map(rent => ({
      ...rent.toObject(),
      rentDate: rent.rentDate.toISOString().split('T')[0],
      lastDateWithoutFine: rent.lastDateWithoutFine.toISOString().split('T')[0],
      lastDateWithFine: rent.lastDateWithFine.toISOString().split('T')[0]
    }));

    res.status(200).json({ data: formattedRentData })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" })
  }
}

//post vacating letter
export const vacatingLetter = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const hostelId = req.params.id;
    const { date, reason } = req.body.values;

    const rentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );
    const rentDue = await RentInfo.findOne({
      user: userId,
      rentDate,
      status: "Unpaid",
    })
    if (rentDue) {
      throw new Error("Please pay the rent before vacating.");
    }

    await VacatingLetter.create(
      [
        {
          hostelId: hostelId,
          userId: userId,
          vacatingLetterDate: date,
          reason: reason,
        },
      ],
    );
    const user = await Student.findById(userId)
    const room = await HostelRooms.findOne({ _id: user.roomData })

    room.occupants -= 1;
    if (room.occupants < room.capacity && room.status === "occupied") {
      room.status = "vacant";
    }

    await Promise.all([
      user.save(),
      room.save(),
    ]);

    res.status(200).json({
      message:
        "Your vacating letter has been submitted successfully! We hope you had a comfortable and enjoyable stay with us.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// const postVacatingLetter = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { values, userId } = req.body;
//     const rentDate = new Date(
//       Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
//     );
//     const rentDue = await RentDue.findOne({
//       user: userId,
//       rentDate,
//       status: "Unpaid",
//     }).session(session);
//     if (rentDue) {
//       throw new Error("Please pay the rent before vacating.");
//     }
//     await VacatingLetter.create([{ ...values, user: userId }], { session });
//     const user = await User.findById(userId).session(session);
//     const room = await Room.findOne({ roomNo: user.roomNo }).session(session);
//     room.occupants -= 1;
//     if (room.occupants < room.capacity && room.status === "occupied") {
//       room.status = "available";
//     }
//     const roomType = await RoomType.findOneAndUpdate(
//       { _id: room.roomType, status: "unavailable" },
//       { $set: { status: "available" } },
//       {
//         session,
//         new: true,
//       }
//     );
//     user.role = "guest";
//     user.roomNo = undefined;
//     await Promise.all([user.save({ session }), room.save({ session })]);
//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({
//       message:
//         "Your vacating letter has been submitted successfully! We hope you had a comfortable and enjoyable stay with us.",
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };




// generate monthly rent 
cron.schedule("0 0 0 1 * *", async function generateMonthlyRent() {
  try {
    const users = await Student.find({ role: { $ne: "guest" } });
    const rentMonth = new Date().toLocaleString("default", { month: "long" });
    const rentYear = new Date().getFullYear();
    const rentDues = [];

    for (const user of users) {
      const room = await HostelRooms.findOne({ _id: user.roomData });
      const rentAmount = room.room_rent;
      const rentDate = new Date(rentYear, new Date().getMonth(), 1);
      const lastDateWithoutFine = new Date(rentYear, new Date().getMonth(), 5);
      const lastDateWithFine = new Date(rentYear, new Date().getMonth(), 10);

      rentDues.push({
        userId: user._id,
        rentMonth,
        rentDate,
        rentAmount,
        lastDateWithoutFine,
        lastDateWithFine,
        fine: 0,
      });
    }

    await RentInfo.insertMany(rentDues);
  } catch (error) {
    console.error(error);
  }
});

