import express from "express";
import { signUp ,otpVerification,login,addHostel} from '../controllers/hostelAdmin.js';
import uploadMiddleware from '../config/cloudinary.js'




const hosteladminRouter = express.Router();



hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

hosteladminRouter.post('/postLogin',login)

hosteladminRouter.post('/add-Hostel',uploadMiddleware,addHostel)


export default hosteladminRouter;