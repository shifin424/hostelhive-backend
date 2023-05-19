import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { token } from "morgan";

dotenv.config();
console.log("insidel Controller")
export const login = async (req, res, next) => {
  console.log(req.body)
  console.log("reached inside function")

  const email = req.body.email;
  const password = req.body.password;
  if (process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
    const payload = {
      email: email,
    };
    jwt.sign(
      payload,
      process.env.ADMIN_SECRET,
      {
        expiresIn: 3600000,
      },
      
      (err, token) => {
        if (err) console.error("Errors in Token generating");
      
        else {
          console.log(token,"this is the token")
          res.json({
            status: true,
            email: email,
            token: `Bearer ${token}`,
          });
        }
      }
    );
  } else {
    const error = "Incorrect email or password";
    res.json({ errors: error });
  }
};
