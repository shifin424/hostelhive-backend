import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import superadminRouter from "./routes/superAdminRoutes.js";
import HostelAdminRouter from './routes/hostelAdminRoutes.js'
import errorHandler from './middlewares/errorHandler.js';
import dbConnect from './config/dbConnection.js';
const app = express()

dotenv.config()
dbConnect ()

app.use(logger('dev'))
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler)





app.use("/api/hostelAdmin", HostelAdminRouter);
 app.use("/api/superAdmin", superadminRouter);
// app.use("/api/student",  studentRouter);





app.listen(process.env.PORT_NO, (error) => {
  console.log('Server started on port 5000');
});

export default app;