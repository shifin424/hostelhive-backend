import mongoose from 'mongoose';

const hostelRoomSchema = new mongoose.Schema(
    {
        room_no: {
            type: String,
            required: true
        },
        room_type: {
            type: String,
            required: true
        },
        occupants: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        room_image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        },
        room_rent: {
            type: Number,
            required: true
        },
        blocking_rooms: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

const HostelRooms = mongoose.model('HostelRooms', hostelRoomSchema);

export default HostelRooms;
