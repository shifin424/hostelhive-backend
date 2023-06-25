import mongoose from "mongoose";
import Students from '../../models/studentAuth.js'
import Joi from "joi";
import HostelInfo from "../../models/hostelInfo.js";
import HostelRooms from '../../models/hostelroom.js'



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
    const bookingStatus = await Students.find({ _id: studentId }).select('isRequested isVerified')

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
    console.log(hostelDetails);
    
    const now = new Date();
    const daysInMonth  = new Date(
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

    res.status(200).json({ dynamicRent,totalRent,monthlyRent,admitFee})
  } catch (err) {
    console.log("error reaches here");
    res.status(500).json({ message: "Internal Server Error" })
  }
}
