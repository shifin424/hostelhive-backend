// hostelInfo model
import mongoose from 'mongoose';

const hostelInfoSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: true,
    },
    lat: Number,
    lng: Number,
    rooms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rooms',
    },
    isApproved:{
      type:Boolean,
      default:false
    },
    isBlocked:{
      type:Boolean,
      default:false
    },
    description: {
      type: String,
      required: true,
    },
    hostelImage: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    hostelReviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  },
  { timestamps: true }
);

const HostelInfo = mongoose.model('HostelInfo', hostelInfoSchema);

export default HostelInfo;
