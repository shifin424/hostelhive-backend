import express from 'express';
import { login } from '../controllers/superAdmin.js';

const superadminRouter = express.Router();

superadminRouter.post('/login', login);

export default superadminRouter;
