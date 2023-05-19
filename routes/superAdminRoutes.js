import express from 'express';
import { login } from '../controllers/superAdmin.js';
//import verifyToken from '../middlewares/authorizaion.js';

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

export default superadminRouter;
