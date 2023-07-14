import express from "express";
import {
    signUp, otpVerification, login, addHostel, hostelData, roomData,
    fetchRoomData, studentRequestData, complaintsData, approval, rejected,
    editMenu, fetchFoodData, StudentData, blockStudent, unblockStudent,
    deleteStudent, addFoodMenu, editRoomData, LeaveData, editComplaint,
    VacateData
} from '../controllers/Hostel/hostelAdmin.js';
import uploadImage from '../config/cloudinary.js'
import veryfyToken from '../middlewares/authorizaion.js'

const hosteladminRouter = express.Router();


hosteladminRouter.post('/signing', signUp);

hosteladminRouter.post('/verifyOtp', otpVerification)

hosteladminRouter.post('/postLogin', login)

hosteladminRouter.post('/add-Hostel', veryfyToken.verifyTokenHostelAdmin, uploadImage, addHostel)

hosteladminRouter.get('/get-hostel-data', veryfyToken.verifyTokenHostelAdmin, hostelData)

hosteladminRouter.post('/add-rooms/:id', veryfyToken.verifyTokenHostelAdmin, uploadImage, roomData)

hosteladminRouter.get('/room-data/:id', veryfyToken.verifyTokenHostelAdmin, fetchRoomData)

hosteladminRouter.get('/edit-room-data/:id', veryfyToken.verifyTokenHostelAdmin, editRoomData)

hosteladminRouter.get('/fetchRequestData/:id', veryfyToken.verifyTokenHostelAdmin, studentRequestData)

hosteladminRouter.patch('/student-approval/:id', veryfyToken.verifyTokenHostelAdmin, approval)

hosteladminRouter.patch('/student-rejection/:id', veryfyToken.verifyTokenHostelAdmin, rejected)

hosteladminRouter.put('/edit-food-menu/:id', veryfyToken.verifyTokenHostelAdmin, editMenu)

hosteladminRouter.get('/fetch-food-menu/:id', veryfyToken.verifyTokenHostelAdmin, fetchFoodData)

hosteladminRouter.get('/fetch-student-data/:id', veryfyToken.verifyTokenHostelAdmin, StudentData)

hosteladminRouter.patch('/block-student/:id', veryfyToken.verifyTokenHostelAdmin, blockStudent)

hosteladminRouter.patch('/unblock-student/:id', veryfyToken.verifyTokenHostelAdmin, unblockStudent)

hosteladminRouter.patch('/delete-student/:id', veryfyToken.verifyTokenHostelAdmin, deleteStudent)

hosteladminRouter.post('/add-food-menu/:id', veryfyToken.verifyTokenHostelAdmin, addFoodMenu)

hosteladminRouter.get('/complaints-data/:id', veryfyToken.verifyTokenHostelAdmin, complaintsData)

hosteladminRouter.patch('/edit-complaints-data/:id', veryfyToken.verifyTokenHostelAdmin, editComplaint)

hosteladminRouter.get('/fetch-leave-data/:id', veryfyToken.verifyTokenHostelAdmin, LeaveData)

hosteladminRouter.get('/fetch-vacate-letters/:id',veryfyToken.verifyTokenHostelAdmin,VacateData)


export default hosteladminRouter;