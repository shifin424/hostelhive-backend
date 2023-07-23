import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(

    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: Number,
            required: true
        },

    },
    {
        timestamps: true,
        expires: 180,
    }
);
const Otp =  mongoose.model('Otp',otpSchema)
export default Otp