import express from "express";
import { signUp ,otpVerification,login,addHostel} from '../controllers/hostelAdmin.js';
import uploadImage from '../config/cloudinary.js'
import veryfyToken from '../middlewares/authorizaion.js'




const hosteladminRouter = express.Router(); 



hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

hosteladminRouter.post('/postLogin',login)

hosteladminRouter.post('/add-Hostel',veryfyToken.verifyTokenHostelAdmin,uploadImage,addHostel)


export default hosteladminRouter;