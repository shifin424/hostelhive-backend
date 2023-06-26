import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
        rentAmount: {
            type: Number,
            required: true
        },
        dateOfPayment: {
            type: Date,
            default: Date.now,
        },
        monthOfPayment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }

)
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;