import express from "express";
import {
    signUp, otpVerification, login, addHostel, hostelData, roomData,
    fetchRoomData, studentRequestData, complaintsData, approval, rejected,
    editMenu, fetchFoodData, StudentData, blockStudent, unblockStudent,
    deleteStudent, addFoodMenu, editRoomData, LeaveData, editComplaint,
    VacateData,fetchStudentRequest,getDashboardData,getDashboardCount,
    getGlobalCount,getGlobalChart,updateRoomData,editRoomImage,
    profileData,editProfileData,editImage
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

hosteladminRouter.get('/fetch-request-data/:id', veryfyToken.verifyTokenHostelAdmin, studentRequestData)

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

hosteladminRouter.get('/fetch-request-data',veryfyToken.verifyTokenHostelAdmin,fetchStudentRequest)

hosteladminRouter.get('/fetch-dashboard-data/:id',veryfyToken.verifyTokenHostelAdmin,getDashboardData)

hosteladminRouter.get('/fetch-dashboard-count/:id',veryfyToken.verifyTokenHostelAdmin,getDashboardCount)

hosteladminRouter.get('/fetch-global-count',veryfyToken.verifyTokenHostelAdmin,getGlobalCount)

hosteladminRouter.get('/fetch-global-chart',veryfyToken.verifyTokenHostelAdmin,getGlobalChart)

hosteladminRouter.put('/update-room-data/:id',veryfyToken.verifyTokenHostelAdmin,updateRoomData)

hosteladminRouter.patch('/fetch-room-image/:id',veryfyToken.verifyTokenHostelAdmin,uploadImage,editRoomImage)

hosteladminRouter.get('/fetch-profile-data/:id',veryfyToken.verifyTokenHostelAdmin,profileData)

hosteladminRouter.put('/edit-hostel-data/:id',veryfyToken.verifyTokenHostelAdmin,editProfileData)

hosteladminRouter.patch('/edit-hostel-image/:id',veryfyToken.verifyTokenHostelAdmin,uploadImage,editImage)


export default hosteladminRouter;