
import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import user from "../Repository/user";
import transporter from "../config/mailer";


const hashOTP = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const forgotPassword = async (
  req: Request,
  res: Response,
) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    console.log(email)

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const userDetails = await user.findOne({ email });

  
    if (!userDetails) {
      return res.status(200).json({
        message: "If the email is registered, an OTP will be sent.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    userDetails.resetOtpHash = hashOTP(otp);
    userDetails.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    userDetails.resetOtpAttempts = 0;

    await userDetails.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userDetails.email,
        subject: "PumpCheck - Password Reset OTP",
        text: `Your PumpCheck password reset OTP is ${otp}. It expires in 10 minutes.`,
        html: `
          <h2>PumpCheck Password Reset</h2>
          <p>Your password reset OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      userDetails.resetOtpHash = null;
      userDetails.resetOtpExpires = null;
      userDetails.resetOtpAttempts = 0;
      await userDetails.save();

      throw emailError;
    }

    return res.status(200).json({
      message: "If the email is registered, an OTP will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Unable to send OTP. Please try again.",
    });
  }
};


export const verifyResetOTP = async (
  req: Request,
  res: Response,
) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Valid email and 6-digit OTP are required",
      });
    }

    const userDetails = await user.findOne({ email });

    if (!userDetails || !userDetails.resetOtpHash) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    if (
      !userDetails.resetOtpExpires ||
      userDetails.resetOtpExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if ((userDetails.resetOtpAttempts ?? 0) >= 5){
      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (hashOTP(otp) !== userDetails.resetOtpHash) {
      userDetails.resetOtpAttempts = (userDetails.resetOtpAttempts ?? 0) + 1;
      await userDetails.save();

      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "OTP verification failed",
    });
  }
};


export const resetPassword = async (
  req: Request,
  res: Response,
) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!email || !/^\d{6}$/.test(otp) || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const userDetails = await user.findOne({ email });

    if (!userDetails || !userDetails.resetOtpHash) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    if (
      !userDetails.resetOtpExpires ||
      userDetails.resetOtpExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if ((userDetails.resetOtpAttempts ?? 0) >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (hashOTP(otp) !== userDetails.resetOtpHash) {
      userDetails.resetOtpAttempts = (userDetails.resetOtpAttempts ?? 0) + 1;
      await userDetails.save();

      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    const saltRound = Number(process.env.SALTROUND);

    if (!saltRound || !Number.isInteger(saltRound)) {
      throw new Error("Invalid SALTROUND configuration");
    }

    userDetails.password = await bcrypt.hash(newPassword, saltRound);

    userDetails.resetOtpHash = null;
    userDetails.resetOtpExpires = null;
    userDetails.resetOtpAttempts = 0;

    await userDetails.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Password reset failed",
    });
  }
};
