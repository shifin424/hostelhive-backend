import express from "express";
import {
    hostelData, singleHostelView, fetchRoomData,
    signup, OtpVerification, login
} from '../controllers/Landing/index.js';

const LandingPageRouter = express.Router();


LandingPageRouter.get('/hostel-info', hostelData)

LandingPageRouter.get('/hostel-over-view/:id', singleHostelView)

LandingPageRouter.post('/hostel-room-data/:id', fetchRoomData)

LandingPageRouter.post('/signup', signup)

LandingPageRouter.post('/otp', OtpVerification)

LandingPageRouter.post('/login', login)







export default LandingPageRouter