import mongoose from 'mongoose';
const ReviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        roomId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: true
        },
        date: {
            type: Date,
            required: true,
        },
        rating: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },

    { timestamps: true })
const Review = mongoose.model('Review', ReviewSchema);

export default Review;