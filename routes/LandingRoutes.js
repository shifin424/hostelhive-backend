import express from "express";
import {hostelData,singleHostelView ,fetchRoomData} from '../controllers/index.js';


const LandingPageRouter = express.Router(); 


LandingPageRouter.get('/hostel-info',hostelData)

LandingPageRouter.get('/hostel-over-view/:id',singleHostelView)

LandingPageRouter.post('/hostel-room-data/:id',fetchRoomData)






export default LandingPageRouter