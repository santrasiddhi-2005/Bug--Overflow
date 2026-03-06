import Users from "../models/auth.js";

// GET /notifications
export const getNotifications = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await Users.findById(userId).select("notifications").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return newest first
    const notifications = [...(user.notifications ?? [])].reverse();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /notifications/read/:id
export const markNotificationRead = async (req, res) => {
  const userId = req.userId;
  const { id: notifId } = req.params;

  try {
    await Users.findOneAndUpdate(
      { _id: userId, "notifications._id": notifId },
      { $set: { "notifications.$.read": true } }
    );
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /notifications/readAll
export const markAllNotificationsRead = async (req, res) => {
  const userId = req.userId;
  try {
    await Users.findByIdAndUpdate(userId, {
      $set: { "notifications.$[].read": true },
    });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
