import mongoose from "mongoose";
import HostelAdmin from "../models/hostelAdmin.js";
import HostelInfo from "../models/hostelInfo.js";


export const hostelData = async (req,res,next)=>{
    try{

        const hostelListing = await HostelInfo.find({isApproved:"Approved"}).select('hostelImage.url hostelName')
        res.status(200).json(hostelListing)

    }catch(err){
        console.log(err);
    }
}


export const singleHostelView = async (req, res, next) => {
    try {
      const result = await HostelInfo.find({ isApproved: "Approved" })
        .populate({
          path: "adminData",
          select: "fullName mobile email",
        })
        .select("hostelName hostelImage location description adminData");
        console.log(result);
      res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  
