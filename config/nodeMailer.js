import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
   service:"gmail",
   auth:{
       user:process.env.MAILER_EMAIL,
       pass:process.env.MAILER_PASS
   }
    });

export default  transporter