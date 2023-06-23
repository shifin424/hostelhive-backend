import express from "express";
import {request,BookingData} from '../controllers/Student/student.js'
import VerifyToken from '../middlewares/authorizaion.js'


const StudentRouter = express.Router(); 



StudentRouter.post('/request-data/:id/:hostelId',VerifyToken.verifyTokenStudent,request)

StudentRouter.get('/room-booking',VerifyToken.verifyTokenStudent,BookingData)



export default StudentRouter;