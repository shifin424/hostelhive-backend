import mongoose from 'mongoose'


const leaveLetterSchema = new mongoose.Schema(
    {
    hostelId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "HostelInfo",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const LeaveLetter = mongoose.model("LeaveLetter", leaveLetterSchema);

export default LeaveLetter;