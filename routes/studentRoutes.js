import express from "express";
import {request,BookingData,fetchPaymentData,payMentDatas,paymentVerification,studentComplaint,complaintData,foodMenu} from '../controllers/Student/student.js'
import VerifyToken from '../middlewares/authorizaion.js'


const StudentRouter = express.Router(); 



StudentRouter.post('/request-data/:id/:hostelId',VerifyToken.verifyTokenStudent,request)

StudentRouter.get('/room-booking',VerifyToken.verifyTokenStudent,BookingData)

StudentRouter.get('/payment-data/:id',VerifyToken.verifyTokenStudent,fetchPaymentData)

StudentRouter.post('/payment-Request',VerifyToken.verifyTokenStudent,payMentDatas)

StudentRouter.post('/payment-verification',VerifyToken.verifyTokenStudent,paymentVerification)

StudentRouter.post('/student-complaint/:id',VerifyToken.verifyTokenStudent,studentComplaint)

StudentRouter.get('/student-complaint-data/:id',VerifyToken.verifyTokenStudent,complaintData)

StudentRouter.get('/fetch-food-menu/:id',VerifyToken.verifyTokenStudent,foodMenu)




export default StudentRouter;