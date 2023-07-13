import mongoose from 'mongoose';
const VacatingLetterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HostelInfo',
            required: true
        },
        vacatingLetterDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },

    },

    { timestamps: true }

)
const VacatingLetter = mongoose.model('VacatingLetter', VacatingLetterSchema);

export default VacatingLetter;