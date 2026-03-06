import express from "express";

import {
	login,
	signup,
	verifySignupOtp,
	resendSignupOtp,
	forgotPassword,
	verifyResetOtp,
	resetPassword,
} from "../controllers/auth.js";
import { getAllUsers, updateProfile, searchUsers, searchTags, getReputation } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/resend-signup-otp", resendSignupOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.get("/getAllUsers", getAllUsers);
router.get("/search", searchUsers);
router.get("/tags/search", searchTags);
router.get("/reputation/:id", getReputation);
router.patch("/update/:id", auth, updateProfile);

export default router;
