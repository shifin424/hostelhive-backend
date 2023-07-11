import mongoose from 'mongoose';
const RentSchema = new mongoose.Schema(
    {
        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HostelInfo',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        rentMonth: {
            type: String,
            required: true,
        },
        rentDate: {
            type: Date,
            required: true,
        },
        rentAmount: {
            type: Number,
            required: true,
        },
        lastDateWithoutFine: {
            type: Date,
            required: true,
        },
        lastDateWithFine: {
            type: Date,
            required: true,
        },
        fine: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["Paid", "Unpaid"],
            default: "Unpaid",
        },
    })
const RentInfo = mongoose.model('RentInfo', RentSchema);

export default RentInfo;