import mongoose from 'mongoose';

const hostelRoomSchema = new mongoose.Schema(
    {
        room_no: {
            type: String,
        },
        room_type: {
            type: String,
        },
        capacity:{
            type:Number,
        },
        occupants: {
            type: Number,
            default:0
        },
        status: {
            type: String,
        },
        room_image: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        room_rent: {
            type: Number,
        },
        blocking_rooms: {
            type: Boolean,
            default: false
        },
        title:{
            type:String,
        },
        description:{
            type:String,
        }

    },
    { timestamps: true }
);

const HostelRooms = mongoose.model('HostelRooms', hostelRoomSchema);

export default HostelRooms;
