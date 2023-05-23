import express from "express";
import { signUp ,otpVerification} from '../controllers/hostelAdmin.js';




const hosteladminRouter = express.Router();

hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

export default hosteladminRouter;