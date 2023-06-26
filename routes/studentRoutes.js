import express from "express";
import {request,BookingData,fetchPaymentData,payMentDatas} from '../controllers/Student/student.js'
import VerifyToken from '../middlewares/authorizaion.js'


const StudentRouter = express.Router(); 



StudentRouter.post('/request-data/:id/:hostelId',VerifyToken.verifyTokenStudent,request)

StudentRouter.get('/room-booking',VerifyToken.verifyTokenStudent,BookingData)

StudentRouter.get('/payment-data/:id',VerifyToken.verifyTokenStudent,fetchPaymentData)

StudentRouter.post('/payment-Request',VerifyToken.verifyTokenStudent,payMentDatas)




export default StudentRouter;