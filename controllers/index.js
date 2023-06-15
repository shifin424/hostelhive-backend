import mongoose from "mongoose";
import HostelAdmin from "../models/hostelAdmin.js";
import HostelInfo from "../models/hostelInfo.js";


export const hostelData = async (req, res, next) => {
  try {

    const hostelListing = await HostelInfo.find({ isApproved: "Approved" }).select('hostelImage.url hostelName')
    res.status(200).json(hostelListing)

  } catch (err) {
    console.log(err);
  }
}

export const singleHostelView = async (req, res, next) => {
  try {
    const hostelId = req.params.id

    const result = await HostelInfo.findOne({ _id: hostelId, isApproved: "Approved" })
      .populate({
        path: "rooms",
        select: "title room_type room_image.url",
      })
      .populate({
        path: "adminData",
        select: "fullName mobile email",
      })
      .select("hostelName hostelImage description location adminData");

    const rooms = {};

    result.rooms.forEach((room) => {
      if (room.room_type in rooms) {
        rooms[room.room_type].count++;
      } else {
        rooms[room.room_type] = {
          count: 1,
          room_image: room.room_image?.url || null,
        };
      }
    });

    const data = {
      ...result.toObject(),
      rooms: Object.entries(rooms).map(([room_type, { count, room_image }]) => ({
        room_type,
        count,
        room_image,
      })),
    };

    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const fetchRoomData = async (req, res, next) => {
  try {
    const hostelId = req.params.id;
    const { room_type } = req.body;

    const hostel = await HostelInfo.findById(hostelId).populate({
      path: 'rooms',
      match: { room_type },
      select: 'room_image.url room_rent title description occupants capacity',
    });

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    const roomData = hostel.rooms.map(room => ({
      url: room.room_image.url,
      rent: room.room_rent,
      title: room.title,
      description: room.description,
      occupants: room.occupants,
      capacity:room.capacity
    }));

    res.json({ roomData: roomData });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch room data' });
  }
};









