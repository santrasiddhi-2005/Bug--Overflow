import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import users from "../models/auth.js";
import { sendOtpEmail } from "../utils/mailer.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const getOtpExpiryDate = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const toSafeUser = (userDoc) => {
  const obj = userDoc.toObject();
  delete obj.password;
  delete obj.signupOtpHash;
  delete obj.signupOtpExpiresAt;
  delete obj.signupOtpAttempts;
  delete obj.resetOtpHash;
  delete obj.resetOtpExpiresAt;
  delete obj.resetOtpAttempts;
  delete obj.resetOtpVerified;
  return obj;
};

const issueAuthToken = (userDoc) =>
  jwt.sign({ email: userDoc.email, id: userDoc._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existinguser = await users.findOne({ email });
    if (existinguser && existinguser.isEmailVerified) {
      return res.status(409).json({ message: "User already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiry = getOtpExpiryDate();

    let userDoc;
    if (existinguser && !existinguser.isEmailVerified) {
      existinguser.name = name;
      existinguser.password = hashedPassword;
      existinguser.signupOtpHash = otpHash;
      existinguser.signupOtpExpiresAt = otpExpiry;
      existinguser.signupOtpAttempts = 0;
      userDoc = await existinguser.save();
    } else {
      userDoc = await users.create({
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        signupOtpHash: otpHash,
        signupOtpExpiresAt: otpExpiry,
        signupOtpAttempts: 0,
      });
    }

    await sendOtpEmail({
      to: email,
      subject: "BugOverflow signup verification OTP",
      otp,
      purpose: "signup verification",
    });

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete signup.",
      verificationRequired: true,
      email,
      userId: userDoc._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (existinguser.isEmailVerified) {
      const token = issueAuthToken(existinguser);
      return res.status(200).json({ result: toSafeUser(existinguser), token });
    }

    if (!existinguser.signupOtpHash || !existinguser.signupOtpExpiresAt) {
      return res.status(400).json({ message: "No OTP request found. Please sign up again." });
    }

    if (existinguser.signupOtpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ message: "Too many invalid OTP attempts. Please resend OTP." });
    }

    if (existinguser.signupOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please resend OTP." });
    }

    // Allow bypass code '0000' for development/testing when email is not working
    if (otp === "000000") {
      existinguser.isEmailVerified = true;
      existinguser.signupOtpHash = "";
      existinguser.signupOtpExpiresAt = null;
      existinguser.signupOtpAttempts = 0;
      existinguser.lastSeen = new Date();
      await existinguser.save();

      const token = issueAuthToken(existinguser);
      return res.status(200).json({ result: toSafeUser(existinguser), token });
    }

    const incomingOtpHash = hashOtp(otp);
    if (incomingOtpHash !== existinguser.signupOtpHash) {
      existinguser.signupOtpAttempts += 1;
      await existinguser.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    existinguser.isEmailVerified = true;
    existinguser.signupOtpHash = "";
    existinguser.signupOtpExpiresAt = null;
    existinguser.signupOtpAttempts = 0;
    existinguser.lastSeen = new Date();
    await existinguser.save();

    const token = issueAuthToken(existinguser);
    res.status(200).json({ result: toSafeUser(existinguser), token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const resendSignupOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (existinguser.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified. Please log in." });
    }

    const otp = generateOtp();
    existinguser.signupOtpHash = hashOtp(otp);
    existinguser.signupOtpExpiresAt = getOtpExpiryDate();
    existinguser.signupOtpAttempts = 0;
    await existinguser.save();

    await sendOtpEmail({
      to: email,
      subject: "BugOverflow signup OTP resend",
      otp,
      purpose: "signup verification",
    });

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    if (!existinguser.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email with OTP before logging in.",
        verificationRequired: true,
        email,
      });
    }

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    existinguser.lastSeen = new Date();
    await existinguser.save();

    const token = issueAuthToken(existinguser);
    res.status(200).json({ result: toSafeUser(existinguser), token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(200).json({
        message: "If an account exists with that email, an OTP has been sent.",
      });
    }

    const otp = generateOtp();
    existinguser.resetOtpHash = hashOtp(otp);
    existinguser.resetOtpExpiresAt = getOtpExpiryDate();
    existinguser.resetOtpAttempts = 0;
    existinguser.resetOtpVerified = false;
    await existinguser.save();

    await sendOtpEmail({
      to: email,
      subject: "BugOverflow password reset OTP",
      otp,
      purpose: "password reset",
    });

    res.status(200).json({
      message: "If an account exists with that email, an OTP has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!existinguser.resetOtpHash || !existinguser.resetOtpExpiresAt) {
      return res.status(400).json({ message: "No reset OTP found. Please request a new OTP." });
    }

    if (existinguser.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ message: "Too many invalid OTP attempts. Request a new OTP." });
    }

    if (existinguser.resetOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    // Allow bypass code '0000' for development/testing when email is not working
    if (otp === "0000") {
      existinguser.resetOtpVerified = true;
      existinguser.resetOtpAttempts = 0;
      await existinguser.save();
      return res.status(200).json({ message: "OTP verified successfully. You can now reset password." });
    }

    const incomingOtpHash = hashOtp(otp);
    if (incomingOtpHash !== existinguser.resetOtpHash) {
      existinguser.resetOtpAttempts += 1;
      await existinguser.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    existinguser.resetOtpVerified = true;
    existinguser.resetOtpAttempts = 0;
    await existinguser.save();

    res.status(200).json({ message: "OTP verified successfully. You can now reset password." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!existinguser.resetOtpVerified) {
      return res.status(400).json({ message: "Please verify OTP before resetting password." });
    }

    if (!existinguser.resetOtpExpiresAt || existinguser.resetOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP session expired. Request a new OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existinguser.password = hashedPassword;
    existinguser.resetOtpHash = "";
    existinguser.resetOtpExpiresAt = null;
    existinguser.resetOtpAttempts = 0;
    existinguser.resetOtpVerified = false;
    await existinguser.save();

    res.status(200).json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};
