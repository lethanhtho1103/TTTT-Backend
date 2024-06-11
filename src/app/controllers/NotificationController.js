const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const { user_id, status, message } = req.body;
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      const newNotification = new Notification({
        userId: user_id, // Sử dụng đúng biến user_id
        create_at: new Date().toISOString(),
        status,
        message,
      });

      const notification = await newNotification.save();

      // Gửi thông báo tới admin
      const admins = await User.find({ admin: true });
      admins.forEach(admin => {
        // Giả lập gửi thông báo qua email hoặc các phương thức khác
        console.log(`Notify admin (${admin.email}): ${message}`);
      });

      return res.status(200).json({
        message: "Notification created successfully.",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndDelete(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NotificationController();
