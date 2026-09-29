const Notification = require("../models/Notification");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createNotification = catchAsync(async (req, res, next) => {
  const {
    title,
    message,
    type,
    recipientRole,
    recipientId,
  } = req.body;

  if (!title || !message) {
    return next(new AppError("Title and message are required", 400));
  }

  const notification = await Notification.create({
    title,
    message,
    type,
    recipientRole,
    recipientId: recipientId || null,
  });

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: notification,
  });
});

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    count: notifications.length,
    data: notifications,
  });
});

exports.getNotificationsByRole = catchAsync(async (req, res, next) => {
  const { role } = req.params;

  if (!role) {
    return next(new AppError("Role is required", 400));
  }

  const notifications = await Notification.find({
    recipientRole: role,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    count: notifications.length,
    data: notifications,
  });
});

exports.getNotificationById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification fetched successfully",
    data: notification,
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});