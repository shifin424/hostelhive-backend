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
    isApproved: {
      type: String,
      default: "Pending"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: true,
    },
    hostelImage: {

      public_id: {
        type: String,
      },
      url:{
        type:String
      }
   
    },
    location:{
      type:String
    },
    hostelReviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
    adminData: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HostelAdmin',
      },
    
  },
  { timestamps: true }
);

const HostelInfo = mongoose.model('HostelInfo', hostelInfoSchema);

export default HostelInfo;
