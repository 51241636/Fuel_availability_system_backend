
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";


dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER or EMAIL_PASS is missing");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export default transporter;
