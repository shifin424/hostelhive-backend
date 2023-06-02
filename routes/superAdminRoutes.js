import express from 'express';
import { login ,requests,approval} from '../controllers/superAdmin.js';
import verifyToken from '../middlewares/authorizaion.js'

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

superadminRouter.get('/hostel-request',verifyToken.verifyTokenSuperAdmin,requests)

superadminRouter.get('/approve',verifyToken.verifyTokenHostelAdmin,approval)

export default superadminRouter;
