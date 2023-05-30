import express from 'express';
import { login } from '../controllers/superAdmin.js';

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

//superadminRouter.get('/hostel-requests',requests)

export default superadminRouter;
