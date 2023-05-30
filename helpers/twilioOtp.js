import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const serviceSID = process.env.TWILIO_SERVICE_SID;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSID, authToken);


export const sendOtp = (mobileNumber) => {
  const no = parseInt(mobileNumber)
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceSID)
      .verifications.create({
        to: `+91${no}`,
        channel: "sms",
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject({ status: error.status, message: error.message });
      });
  });
};

export const verifyOtp = (mobileNumber, otpCode) => {
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceSID)
      .verificationChecks.create({
        to: `+91${mobileNumber}`,
        code: otpCode,
      })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject({ status: error.status, message: error.message });
      });
  });
};
