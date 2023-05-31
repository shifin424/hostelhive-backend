import express from 'express';
import { login ,requests} from '../controllers/superAdmin.js';
import verifyToken from '../middlewares/authorizaion.js'

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

superadminRouter.get('/hostel-request',verifyToken.verifyTokenSuperAdmin,requests)

export default superadminRouter;
