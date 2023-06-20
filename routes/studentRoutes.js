import express from "express";
import {request} from '../controllers/Student/student.js'
import VerifyToken from '../middlewares/authorizaion.js'


const StudentRouter = express.Router(); 



StudentRouter.post('/request-data/:id',VerifyToken.verifyTokenStudent,request)



export default StudentRouter;