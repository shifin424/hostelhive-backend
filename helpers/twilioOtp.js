import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const serviceSID = process.env.TWILIO_SERVICE_SID;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSID, authToken);

export const sendOtp = (mobileNumber) => {
  console.log(mobileNumber);
  return new Promise((resolve, reject) => {
    console.log("reached to sendOtp");
    client.verify.v2
      .services(serviceSID)
      .verifications.create({
        to: `+91${mobileNumber}`,
        channel: "sms",
      })
      .then((result) => {
        console.log(result.status);
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
        resolve(result);
      })
      .catch((error) => {
        reject({ status: error.status, message: error.message });
      });
  });
};
