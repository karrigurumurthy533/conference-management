const Conference = require("../models/conference");
const Role = require("../models/role");
const Registration = require("../models/Registration");
const Employee = require("../models/Employee");
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
    // Total Conferences
    Conference.countDocuments(),

    // Total Employees
    Employee.countDocuments(),

    // Total Registrations
    Registration.countDocuments(),

    // Total Speakers
    Speaker.countDocuments(),

    // Total Paid Revenue
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
    revenueData.length > 0
      ? revenueData[0].totalRevenue
      : 0;

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


exports.getAdminDashboardOverview = catchAsync(
  async (req, res, next) => {

    // ==========================================================
    // CURRENT YEAR
    // ==========================================================

    const currentYear =
      new Date().getFullYear();


    // ==========================================================
    // REGISTRATION OVERVIEW
    //
    // Registration.createdAt based
    // ==========================================================

    const registrationData =
      await Registration.aggregate([

        // ------------------------------------------------------
        // Only registrations having createdAt
        // ------------------------------------------------------

        {
          $match: {
            createdAt: {
              $exists: true,
              $ne: null,
            },
          },
        },


        // ------------------------------------------------------
        // Group by year + month
        // ------------------------------------------------------

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            registrations: {
              $sum: 1,
            },
          },
        },


        // ------------------------------------------------------
        // Sort by year and month
        // ------------------------------------------------------

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },

      ]);


    // ==========================================================
    // CURRENT YEAR REGISTRATIONS ONLY
    // ==========================================================

    const currentYearData =
      registrationData.filter(
        (item) =>
          item?._id?.year ===
          currentYear
      );


    // ==========================================================
    // ALL MONTHS
    // ==========================================================

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];


    // ==========================================================
    // BUILD REGISTRATION OVERVIEW
    //
    // Every month will be returned.
    // If no registration -> 0
    // If one registration -> 1
    // ==========================================================

    const registrationOverview =
      monthNames.map(
        (month, index) => {

          const monthNumber =
            index + 1;


          const found =
            currentYearData.find(
              (item) =>
                item?._id?.month ===
                monthNumber
            );


          return {
            month,

            registrations:
              found?.registrations || 0,
          };
        }
      );


    // ==========================================================
    // RECENT CONFERENCES
    //
    // Title directly from Conference
    // ==========================================================

    const recentConferences =
      await Conference.find({})
        .sort({
          createdAt: -1,
        })
        .limit(4)
        .select(
          "title status createdAt conferenceDates"
        )
        .lean();


    // ==========================================================
    // RECENT REGISTRATIONS
    // ==========================================================

    const recentRegistrations =
      await Registration.find({})
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "conference firstName lastName email createdAt"
        )
        .lean();


    // ==========================================================
    // RECENT SPEAKERS
    // ==========================================================

    const recentSpeakers =
      await Speaker.find({})
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name firstName lastName conferenceId createdAt"
        )
        .lean();


    // ==========================================================
    // RECENT ACTIVITIES
    // ==========================================================

    const recentActivities = [];


    // ==========================================================
    // REGISTRATION ACTIVITIES
    // ==========================================================

    recentRegistrations.forEach(
      (registration) => {

        recentActivities.push({

          title:
            "New registration received",

          description:
            registration?.conference?.title ||
            registration?.conference?.name ||
            "Conference registration",

          time:
            registration?.createdAt,

          type:
            "registration",

          icon:
            "UserCheck",
        });

      }
    );


    // ==========================================================
    // SPEAKER ACTIVITIES
    // ==========================================================

    recentSpeakers.forEach(
      (speaker) => {

        recentActivities.push({

          title:
            "Speaker profile added",

          description:
            speaker?.name ||
            `${speaker?.firstName || ""} ${
              speaker?.lastName || ""
            }`.trim() ||
            "New speaker",

          time:
            speaker?.createdAt,

          type:
            "speaker",

          icon:
            "Mic2",
        });

      }
    );


    // ==========================================================
    // SORT ACTIVITIES
    // NEWEST FIRST
    // ==========================================================

    recentActivities.sort(
      (a, b) =>
        new Date(b.time) -
        new Date(a.time)
    );


    // ==========================================================
    // ONLY 5 ACTIVITIES
    // ==========================================================

    const activities =
      recentActivities.slice(
        0,
        5
      );


    // ==========================================================
    // RESPONSE
    // ==========================================================

    res.status(200).json({

      success: true,

      message:
        "Admin dashboard overview fetched successfully",

      data: {

        registrationOverview,

        recentConferences,

        recentActivities:
          activities,
      },

    });

  }
);