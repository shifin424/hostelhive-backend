// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import logger from 'morgan';
// import superadminRouter from "./routes/superAdminRoutes.js";
// import HostelAdminRouter from './routes/hostelAdminRoutes.js'
// import errorHandler from './middlewares/errorHandler.js';
// import dbConnect from './config/dbConnection.js';
// const app = express()
// const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
// const mapboxApiUrl = 'https://api.mapbox.com/styles/v1/shifin/cli4kd4ho00nh01pgdruxf59b';


// dotenv.config()
// dbConnect ()

// app.use(logger('dev'))
// app.use(
//   cors({
//     credentials: true,
//     origin: ['http://localhost:3000',"*"]
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(errorHandler)





// app.use("/api/hostelAdmin", HostelAdminRouter);
//  app.use("/api/superAdmin", superadminRouter);
// // app.use("/api/student",  studentRouter);





// app.listen(process.env.PORT_NO, (error) => {
//   console.log('Server started on port 5000');
// });

// export default app;



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import superadminRouter from "./routes/superAdminRoutes.js";
import HostelAdminRouter from './routes/hostelAdminRoutes.js'
import LandingPageRouter from './routes/LandingRoutes.js'
import errorHandler from './middlewares/errorHandler.js';
import dbConnect from './config/dbConnection.js';


const app = express();

dotenv.config();
dbConnect();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', "*"]

  })
);

app.use("/api/hostel", HostelAdminRouter);
app.use("/api/admin", superadminRouter);
app.use("/api",LandingPageRouter)

app.listen(process.env.PORT_NO, (error) => {
  if (error) {
    console.error('Error starting the server:', error);
  } else {
    console.log('Server started on port', process.env.PORT_NO);
  }
});
