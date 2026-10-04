const mongoose = require("mongoose");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// ======================================================
// GET NOTIFICATIONS COLLECTION
// ======================================================

const getNotificationsCollection = () => {
  return mongoose.connection.collection("notifications");
};

// ======================================================
// CREATE NOTIFICATION
// ======================================================

exports.createNotification = catchAsync(
  async (req, res, next) => {
    const {
      title,
      message,
      type,
      recipientRole,
      recipientId,
    } = req.body;

    if (!title || !message) {
      return next(
        new AppError(
          "Title and message are required",
          400
        )
      );
    }

    const notification = {
      title: title.trim(),
      message: message.trim(),
      type: type || "info",
      recipientRole: recipientRole || null,
      recipientId: recipientId
        ? new mongoose.Types.ObjectId(recipientId)
        : null,
      isRead: false,
      readAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result =
      await getNotificationsCollection().insertOne(
        notification
      );

    const createdNotification = {
      _id: result.insertedId,
      ...notification,
    };

    res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      data: createdNotification,
    });
  }
);

// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

exports.getAllNotifications = catchAsync(
  async (req, res) => {
    const notifications =
      await getNotificationsCollection()
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json({
      success: true,
      message:
        "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  }
);

// ======================================================
// GET NOTIFICATIONS BY ROLE
// ======================================================

exports.getNotificationsByRole = catchAsync(
  async (req, res, next) => {
    const { role } = req.params;

    if (!role) {
      return next(
        new AppError("Role is required", 400)
      );
    }

    const notifications =
      await getNotificationsCollection()
        .find({
          recipientRole: role,
        })
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json({
      success: true,
      message:
        "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  }
);

// ======================================================
// GET NOTIFICATION BY ID
// ======================================================

exports.getNotificationById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError(
          "Invalid notification ID",
          400
        )
      );
    }

    const notification =
      await getNotificationsCollection().findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

    if (!notification) {
      return next(
        new AppError(
          "Notification not found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Notification fetched successfully",
      data: notification,
    });
  }
);

// ======================================================
// MARK AS READ
// ======================================================

exports.markAsRead = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError(
          "Invalid notification ID",
          400
        )
      );
    }

    const result =
      await getNotificationsCollection().findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: "after",
        }
      );

    if (!result) {
      return next(
        new AppError(
          "Notification not found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      data: result,
    });
  }
);

// ======================================================
// MARK ALL AS READ
// ======================================================

exports.markAllAsRead = catchAsync(
  async (req, res) => {
    const result =
      await getNotificationsCollection().updateMany(
        {
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  }
);



exports.deleteNotification = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError(
          "Invalid notification ID",
          400
        )
      );
    }

    const result =
      await getNotificationsCollection().deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return next(
        new AppError(
          "Notification not found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully",
    });
  }
);