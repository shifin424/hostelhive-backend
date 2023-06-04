import express from "express";
import { signUp ,otpVerification,login,addHostel,hostelData} from '../controllers/hostelAdmin.js';
import uploadImage from '../config/cloudinary.js'
import veryfyToken from '../middlewares/authorizaion.js'




const hosteladminRouter = express.Router(); 



hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

hosteladminRouter.post('/postLogin',login)

hosteladminRouter.post('/add-Hostel',veryfyToken.verifyTokenHostelAdmin,uploadImage,addHostel)

hosteladminRouter.get('/get-hostel-data',veryfyToken.verifyTokenHostelAdmin,hostelData)




export default hosteladminRouter;