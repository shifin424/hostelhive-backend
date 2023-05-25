import express from "express";
import { signUp ,otpVerification,login} from '../controllers/hostelAdmin.js';




const hosteladminRouter = express.Router();

hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

hosteladminRouter.post('/postLogin',login)

export default hosteladminRouter;