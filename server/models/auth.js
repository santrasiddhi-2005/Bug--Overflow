import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  signupOtpHash: { type: String, default: "" },
  signupOtpExpiresAt: { type: Date, default: null },
  signupOtpAttempts: { type: Number, default: 0 },
  resetOtpHash: { type: String, default: "" },
  resetOtpExpiresAt: { type: Date, default: null },
  resetOtpAttempts: { type: Number, default: 0 },
  resetOtpVerified: { type: Boolean, default: false },
  about: { type: String },
  tags: { type: [String] },
  location: { type: String, default: "" },
  links: {
    website: { type: String, default: "" },
    x: { type: String, default: "" },
    github: { type: String, default: "" },
  },
  joinedOn: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  reputation: { type: Number, default: 1 },
  badges: {
    bronze: { type: [String], default: [] },
    silver: { type: [String], default: [] },
    gold: { type: [String], default: [] },
  },
  bookmarks: { type: [String], default: [] },
  articleBookmarks: { type: [String], default: [] },
  notifications: [
    {
      message: { type: String, required: true },
      link: { type: String },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("User", userSchema);
