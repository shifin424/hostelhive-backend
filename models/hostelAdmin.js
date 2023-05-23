import mongoose from 'mongoose';

const hosteladminSchema = new mongoose.Schema(
  {
    hosteldata: [
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
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      default: "not Paid",
    },
    qualificaton: {
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

const hosteladmin = mongoose.model("hostelAdmin", hosteladminSchema);

export default hosteladmin;
