import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/Notifications.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/read/:id", auth, markNotificationRead);
router.patch("/readAll", auth, markAllNotificationsRead);

export default router;
