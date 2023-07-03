import express from "express";
import { signUp ,otpVerification,login,addHostel,hostelData,roomData,fetchRoomData, studentRequestData,approval, rejected,editMenu} from '../controllers/hostelAdmin.js';
import uploadImage from '../config/cloudinary.js'
import veryfyToken from '../middlewares/authorizaion.js'




const hosteladminRouter = express.Router(); 



hosteladminRouter.post('/signing',signUp);

hosteladminRouter.post('/verifyOtp',otpVerification)

hosteladminRouter.post('/postLogin',login)

hosteladminRouter.post('/add-Hostel',veryfyToken.verifyTokenHostelAdmin,uploadImage,addHostel)

hosteladminRouter.get('/get-hostel-data',veryfyToken.verifyTokenHostelAdmin,hostelData)

hosteladminRouter.post('/add-rooms/:id',veryfyToken.verifyTokenHostelAdmin,uploadImage,roomData)

hosteladminRouter.get('/room-data/:id',veryfyToken.verifyTokenHostelAdmin,fetchRoomData)

hosteladminRouter.get('/fetchRequestData/:id',veryfyToken.verifyTokenHostelAdmin,studentRequestData)

hosteladminRouter.patch('/student-approval/:id',veryfyToken.verifyTokenHostelAdmin,approval)

hosteladminRouter.patch('/student-rejection/:id',veryfyToken.verifyTokenHostelAdmin,rejected)

hosteladminRouter.put('/edit-food-menu/:id',veryfyToken.verifyTokenHostelAdmin,editMenu)




export default hosteladminRouter;