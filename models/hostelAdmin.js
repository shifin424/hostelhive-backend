import mongoose from 'mongoose';

const hosteladminSchema = new mongoose.Schema(
  {
    hosteldata: {
      type: [
        {
          hostelId: {
            type: String,
            required: true,
          },
          hostelName: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    adminImage: {
      public_id: {
        type: String,
      },
      url:{
        type:String
      }
    },
    walletTotal: {
      type: Number,
      default: 0
    },
    walletDetails: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      default: "Guest",
    },
    paymentStatus: {
      type: String,
      default: "not Paid",
    },
    qualification: {
      type: String,
      required: true,
    },
    Address: [
      {
        landMark: {
          type: String,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const HostelAdmin = mongoose.model('HostelAdmin', hosteladminSchema);

export default HostelAdmin;