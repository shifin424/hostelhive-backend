import mongoose from "mongoose";

const hostelInfoSchema = new mongoose.Schema(

    {
        hostelName:{
            type:String,
            required :true
        },
        location: {
            type: {
              type: String,
              enum: ['Point'],
              required: true,
            },
            coordinates: {
              type: [Number],
              required: true,
            },
          },
        rooms:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'rooms',
            required:true
        },
        descripton:{
            type:String,
            requred:true
        },
        hostelImage:{
            url: {
                type: String,
              },
              filename: {
                type: String,
              },
        },hostelReviews:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'reviews'
        }
        
    },
    { timestamps: true }
)

const hoselInfo = mongoose.model("hoselInfo",hostelInfoSchema)

export default hoselInfo