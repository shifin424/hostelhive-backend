import mongoose from "mongoose";
import Students from '../../models/studentAuth.js'
import Joi from "joi";
import HostelInfo from "../../models/hostelInfo.js";



export const request = async (req, res, next) => {
    try {
      const roomId = req.params.id;
      const userId = req.user.id;
      const userData = req.body;
  
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
        },
      });
  
      res.status(200).json({ isRequested: true });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  };

