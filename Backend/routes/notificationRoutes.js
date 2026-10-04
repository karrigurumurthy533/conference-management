const express = require("express");

const NotificationController = require("../controllers/NotificationController");

const router = express.Router();

// ======================================================
// CREATE NOTIFICATION
// ======================================================

router.post(
  "/",
  NotificationController.createNotification
);

// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

router.get(
  "/",
  NotificationController.getAllNotifications
);

// ======================================================
// GET NOTIFICATIONS BY ROLE
// ======================================================

router.get(
  "/role/:role",
  NotificationController.getNotificationsByRole
);

// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// IMPORTANT: keep this BEFORE /:id
// ======================================================

router.patch(
  "/read-all",
  NotificationController.markAllAsRead
);

// ======================================================
// GET NOTIFICATION BY ID
// ======================================================

router.get(
  "/:id",
  NotificationController.getNotificationById
);

// ======================================================
// MARK SINGLE NOTIFICATION AS READ
// ======================================================

router.patch(
  "/:id/read",
  NotificationController.markAsRead
);

// ======================================================
// DELETE NOTIFICATION
// ======================================================

router.delete(
  "/:id",
  NotificationController.deleteNotification
);

module.exports = router;