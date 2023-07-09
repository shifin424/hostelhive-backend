import express from 'express';
import {
    login, requests, approval, rejected,
    hostelData, blockHostel, unblockHostel
} from '../controllers/Admin/superAdmin.js';
import verifyToken from '../middlewares/authorizaion.js'

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

superadminRouter.get('/hostel-request', verifyToken.verifyTokenSuperAdmin, requests)

superadminRouter.patch('/approve-hostel/:id', verifyToken.verifyTokenSuperAdmin, approval)

superadminRouter.patch('/reject-hostel/:id', verifyToken.verifyTokenSuperAdmin, rejected)

superadminRouter.get('/fetchHostelData', verifyToken.verifyTokenSuperAdmin, hostelData)

superadminRouter.patch('/block-hostel/:id/:adminId', verifyToken.verifyTokenSuperAdmin, blockHostel)

superadminRouter.patch('/unblock-hostel/:id/:adminId', verifyToken.verifyTokenSuperAdmin, unblockHostel)


export default superadminRouter;
