import mongoose from 'mongoose'


const completeSchema = new mongoose.Schema(
    {
        hostelId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "HostelInfo",
            required: true,
        },
        complaintType: {
            type: String,
            enum: ["Maintenance", "Security", "Cleanliness", "Others"],
            required: true,
        },
        complaintDescription: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["New", "In Progress", "Resolved"],
            default: "New",
        },
        adminResponse: {
            type: String,
            default: "",
        },
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
    },
    { timestamps: true }
);

const Complaints = mongoose.model('Complaints', completeSchema);

export default Complaints;
