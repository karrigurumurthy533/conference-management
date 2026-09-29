const Attendance = require("../models/Attendance");
const Conference = require("../models/conference");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getConferenceAttendance = catchAsync(async (req, res, next) => {
  const { conferenceId } = req.params;

  if (!conferenceId) {
    return next(new AppError("Conference ID is required", 400));
  }

  const conference = await Conference.findById(conferenceId);

  if (!conference) {
    return next(new AppError("Conference not found", 404));
  }

  const attendance = await Attendance.find({
    conferenceId: conferenceId,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Conference attendance fetched successfully",
    conferenceId: conferenceId,
    count: attendance.length,
    data: attendance,
  });
});