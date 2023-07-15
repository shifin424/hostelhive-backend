import express from "express";
import {
    request, BookingData, fetchPaymentData, payMentDatas,
    paymentVerification, studentComplaint, complaintData,
    foodMenu, leaveLetter, fetchLeaveData,rentHistory,
    rentDueData,vacatingLetter,roomReview,profileData
} from '../controllers/Student/student.js'
import VerifyToken from '../middlewares/authorizaion.js'

const StudentRouter = express.Router();


StudentRouter.post('/request-data/:id/:hostelId', VerifyToken.verifyTokenStudent, request)

StudentRouter.get('/room-booking', VerifyToken.verifyTokenStudent, BookingData)

StudentRouter.get('/payment-data/:id', VerifyToken.verifyTokenStudent, fetchPaymentData)

StudentRouter.post('/payment-Request', VerifyToken.verifyTokenStudent, payMentDatas)

StudentRouter.post('/payment-verification/:id', VerifyToken.verifyTokenStudent, paymentVerification)

StudentRouter.post('/student-complaint/:id', VerifyToken.verifyTokenStudent, studentComplaint)

StudentRouter.get('/student-complaint-data/:id', VerifyToken.verifyTokenStudent, complaintData)

StudentRouter.get('/fetch-food-menu/:id', VerifyToken.verifyTokenStudent, foodMenu)

StudentRouter.post('/add-leave-letter/:id', VerifyToken.verifyTokenStudent, leaveLetter)

StudentRouter.get('/fetch-leave-letter/:id', VerifyToken.verifyTokenStudent, fetchLeaveData)

StudentRouter.get('/fetch-rent-history/:id',VerifyToken.verifyTokenStudent,rentHistory)

StudentRouter.get('/fetch-rent-due-data',VerifyToken.verifyTokenStudent,rentDueData)

StudentRouter.post('/post-vacating-data/:id',VerifyToken.verifyTokenStudent,vacatingLetter)

StudentRouter.post('/add-room-review/:id',VerifyToken.verifyTokenStudent,roomReview)

StudentRouter.get('/fetch-profile-data',VerifyToken.verifyTokenStudent,profileData)


export default StudentRouter;