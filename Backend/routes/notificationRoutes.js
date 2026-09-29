const express = require("express");
const NotificationController = require("../controllers/NotificationController");

const router = express.Router();

router.post("/", NotificationController.createNotification);
router.get("/", NotificationController.getAllNotifications);
router.get("/role/:role", NotificationController.getNotificationsByRole);
router.get("/:id", NotificationController.getNotificationById);
router.patch("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.deleteNotification);

module.exports = router;