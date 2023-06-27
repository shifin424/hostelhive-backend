import mongoose from 'mongoose';

const hostelInfoSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HostelRooms',
      }
    ],
    isApproved: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectedReason: {
      type: String,
      default: "none"
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    hostelType: {
      type: String,
      required: true
    },
    admissionFees: {
      type: Number,
      required: true
    },
    hostelImage: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
    },
    location: {
      type: String,
      required: true
    },
    hostelReviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
    adminData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelAdmin',
      required: true
    }
  },
  { timestamps: true }
);

const HostelInfo = mongoose.model('HostelInfo', hostelInfoSchema);

export default HostelInfo;
