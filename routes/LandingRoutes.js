import express from "express";
import {hostelData,singleHostelView } from '../controllers/index.js';


const LandingPageRouter = express.Router(); 


LandingPageRouter.get('/hostel-info',hostelData)

LandingPageRouter.get('/hostel-over-view',singleHostelView)






export default LandingPageRouter