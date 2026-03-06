import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import commentRoutes from "./routes/Comments.js";
import bookmarkRoutes from "./routes/Bookmarks.js";
import notificationRoutes from "./routes/Notifications.js";
import viewRoutes from "./routes/Views.js";
import articleRoutes from "./routes/Articles.js";
import connectDB from "./connectMongoDb.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Global rate limiter: max 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later." },
});

// app.use("/", (req, res) => {
//   res.send("This is a bugoverflow clone API");
// });

app.use("/user", authLimiter, userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/comments", commentRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/notifications", notificationRoutes);
app.use("/views", viewRoutes);
app.use("/articles", articleRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
