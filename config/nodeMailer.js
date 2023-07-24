import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
   service:"gmail",
   auth:{
       user:'hostelhive242@gmail.com',
       pass:'ljtiuakqpbaeiafz'
   }
    });

export default  transporter