const express = require("express");
const router = express.Router();

const notificationController = require("../app/controllers/NotificationController");


router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
