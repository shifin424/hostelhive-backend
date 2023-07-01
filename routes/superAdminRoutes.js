import express from 'express';
import { login ,requests,approval,rejected,hostelData} from '../controllers/superAdmin.js';
import verifyToken from '../middlewares/authorizaion.js'

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

superadminRouter.get('/hostel-request',verifyToken.verifyTokenSuperAdmin,requests)

superadminRouter.patch('/approve-hostel/:id',verifyToken.verifyTokenSuperAdmin,approval)

superadminRouter.patch('/reject-hostel/:id',verifyToken.verifyTokenSuperAdmin,rejected)

superadminRouter.get('/fetchHostelData',verifyToken.verifyTokenSuperAdmin,hostelData)




export default superadminRouter;
