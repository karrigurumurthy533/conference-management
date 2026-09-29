const Conference = require("../models/conference");
const Role = require("../models/role");
const Registration = require("../models/Registration");
const Speaker = require("../models/Speaker");
const Abstract = require("../models/Abstract");
const Attendance = require("../models/Attendance");
const catchAsync = require("../utils/catchAsync");

exports.getEmployeeStatistics = catchAsync(async (req, res, next) => {
  const { conferenceId } = req.query;

  const registrationFilter = conferenceId
    ? { "conference.conferenceId": conferenceId }
    : {};

  const speakerFilter = conferenceId
    ? { conferenceId }
    : {};

  const abstractFilter = conferenceId
    ? { conferenceId }
    : {};

  const attendanceFilter = conferenceId
    ? {
        conferenceId,
        attendanceStatus: "Present",
      }
    : {
        attendanceStatus: "Present",
      };

  const [
    totalRegistrations,
    totalSpeakers,
    totalAbstracts,
    totalAttendances,
  ] = await Promise.all([
    Registration.countDocuments(registrationFilter),
    Speaker.countDocuments(speakerFilter),
    Abstract.countDocuments(abstractFilter),
    Attendance.countDocuments(attendanceFilter),
  ]);

  res.status(200).json({
    success: true,
    message: "Employee statistics fetched successfully",
    data: {
      totalRegistrations,
      totalSpeakers,
      totalAbstracts,
      totalAttendances,
    },
  });
});

exports.getAdminStatistics = catchAsync(async (req, res, next) => {
  const [
    totalConferences,
    totalEmployees,
    totalRegistrations,
    totalSpeakers,
    revenueData,
  ] = await Promise.all([
    Conference.countDocuments(),

    Role.countDocuments({
      role: "employee",
      active: true,
    }),

    Registration.countDocuments(),

    Speaker.countDocuments(),

    Registration.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$registration.price",
          },
        },
      },
    ]),
  ]);

  const totalRevenue =
    revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    message: "Admin statistics fetched successfully",
    data: {
      totalConferences,
      totalEmployees,
      totalRegistrations,
      totalRevenue,
      totalSpeakers,
    },
  });
});