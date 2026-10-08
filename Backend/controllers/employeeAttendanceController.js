const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

/*
|--------------------------------------------------------------------------
| Helper: Get Employee ID
|--------------------------------------------------------------------------
*/

const getEmployeeId = (req) => {
  return req.user?.id || req.user?._id;
};

/*
|--------------------------------------------------------------------------
| Helper: Start of Day
|--------------------------------------------------------------------------
*/

const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);

  start.setHours(0, 0, 0, 0);

  return start;
};

/*
|--------------------------------------------------------------------------
| Helper: End of Day
|--------------------------------------------------------------------------
*/

const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);

  end.setHours(23, 59, 59, 999);

  return end;
};

/*
|--------------------------------------------------------------------------
| CLOCK IN
|--------------------------------------------------------------------------
| POST /api/employee-attendance/clock-in
|--------------------------------------------------------------------------
*/

exports.clockIn = catchAsync(async (req, res, next) => {
  const employeeId = getEmployeeId(req);

  if (!employeeId) {
    return next(
      new AppError("Employee authentication required", 401)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Employee
  |--------------------------------------------------------------------------
  */

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return next(
      new AppError("Employee not found", 404)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Current Date
  |--------------------------------------------------------------------------
  */

  const now = new Date();

  const year = now.getFullYear();

  const month = now.getMonth() + 1;

  const todayStart = getStartOfDay(now);

  const todayEnd = getEndOfDay(now);

  /*
  |--------------------------------------------------------------------------
  | Find Monthly Attendance Document
  |--------------------------------------------------------------------------
  */

  let attendance = await Attendance.findOne({
    employee: employeeId,
    year,
    month,
  });

  /*
  |--------------------------------------------------------------------------
  | Create Monthly Document If Not Exists
  |--------------------------------------------------------------------------
  */

  if (!attendance) {
    attendance = await Attendance.create({
      employee: employeeId,
      conference:
        employee.assignedConferences?.[0]?._id ||
        employee.assignedConferences?.[0] ||
        null,
      year,
      month,
      days: [],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Check Whether Today Already Exists
  |--------------------------------------------------------------------------
  */

  const todayAttendance = attendance.days.find((day) => {
    const dayDate = new Date(day.date);

    return (
      dayDate >= todayStart &&
      dayDate <= todayEnd
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Already Checked In
  |--------------------------------------------------------------------------
  */

  if (todayAttendance?.checkIn) {
    return next(
      new AppError(
        "You have already checked in today",
        400
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Today's Attendance
  |--------------------------------------------------------------------------
  */

  if (todayAttendance) {
    todayAttendance.checkIn = now;
    todayAttendance.status = "Present";
  } else {
    attendance.days.push({
      date: now,
      checkIn: now,
      checkOut: null,
      status: "Present",
      workingHours: 0,
    });
  }

  await attendance.save();

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  res.status(200).json({
    success: true,
    message: "Clock-in successful",
    data: {
      attendanceId: attendance._id,
      employeeId: employee._id,
      fullName: employee.fullName,
      date: now,
      checkIn: now,
      status: "Present",
    },
  });
});

/*
|--------------------------------------------------------------------------
| CLOCK OUT
|--------------------------------------------------------------------------
| POST /api/employee-attendance/clock-out
|--------------------------------------------------------------------------
*/

exports.clockOut = catchAsync(async (req, res, next) => {
  const employeeId = getEmployeeId(req);

  if (!employeeId) {
    return next(
      new AppError("Employee authentication required", 401)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Employee
  |--------------------------------------------------------------------------
  */

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return next(
      new AppError("Employee not found", 404)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Current Date
  |--------------------------------------------------------------------------
  */

  const now = new Date();

  const year = now.getFullYear();

  const month = now.getMonth() + 1;

  const todayStart = getStartOfDay(now);

  const todayEnd = getEndOfDay(now);

  /*
  |--------------------------------------------------------------------------
  | Find Monthly Attendance
  |--------------------------------------------------------------------------
  */

  const attendance = await Attendance.findOne({
    employee: employeeId,
    year,
    month,
  });

  if (!attendance) {
    return next(
      new AppError(
        "No attendance record found for this month",
        404
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find Today's Attendance
  |--------------------------------------------------------------------------
  */

  const todayAttendance = attendance.days.find((day) => {
    const dayDate = new Date(day.date);

    return (
      dayDate >= todayStart &&
      dayDate <= todayEnd
    );
  });

  if (!todayAttendance) {
    return next(
      new AppError(
        "You have not checked in today",
        400
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check-In Required
  |--------------------------------------------------------------------------
  */

  if (!todayAttendance.checkIn) {
    return next(
      new AppError(
        "Please check in before checking out",
        400
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Already Checked Out
  |--------------------------------------------------------------------------
  */

  if (todayAttendance.checkOut) {
    return next(
      new AppError(
        "You have already checked out today",
        400
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Calculate Working Hours
  |--------------------------------------------------------------------------
  */

  const checkInTime = new Date(
    todayAttendance.checkIn
  );

  const checkOutTime = now;

  const differenceInMilliseconds =
    checkOutTime.getTime() -
    checkInTime.getTime();

  const workingHours =
    differenceInMilliseconds /
    (1000 * 60 * 60);

  /*
  |--------------------------------------------------------------------------
  | Update Attendance
  |--------------------------------------------------------------------------
  */

  todayAttendance.checkOut = now;

  todayAttendance.workingHours =
    Number(workingHours.toFixed(2));

  todayAttendance.status = "Present";

  await attendance.save();

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  res.status(200).json({
    success: true,
    message: "Clock-out successful",
    data: {
      attendanceId: attendance._id,
      employeeId: employee._id,
      fullName: employee.fullName,
      date: now,
      checkIn: todayAttendance.checkIn,
      checkOut: todayAttendance.checkOut,
      workingHours: todayAttendance.workingHours,
      status: todayAttendance.status,
    },
  });
});

/*
|--------------------------------------------------------------------------
| GET TODAY ATTENDANCE
|--------------------------------------------------------------------------
| GET /api/employee-attendance/today
|--------------------------------------------------------------------------
*/

exports.getTodayAttendance = catchAsync(
  async (req, res, next) => {
    const employeeId = getEmployeeId(req);

    if (!employeeId) {
      return next(
        new AppError(
          "Employee authentication required",
          401
        )
      );
    }

    const now = new Date();

    const year = now.getFullYear();

    const month = now.getMonth() + 1;

    const todayStart = getStartOfDay(now);

    const todayEnd = getEndOfDay(now);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      year,
      month,
    });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const todayAttendance = attendance.days.find(
      (day) => {
        const dayDate = new Date(day.date);

        return (
          dayDate >= todayStart &&
          dayDate <= todayEnd
        );
      }
    );

    res.status(200).json({
      success: true,
      data: todayAttendance || null,
    });
  }
);

/*
|--------------------------------------------------------------------------
| GET MONTHLY ATTENDANCE
|--------------------------------------------------------------------------
| GET /api/employee-attendance/monthly?month=10&year=2026
|--------------------------------------------------------------------------
*/

exports.getMonthlyAttendance = catchAsync(
  async (req, res, next) => {
    const employeeId = getEmployeeId(req);

    if (!employeeId) {
      return next(
        new AppError(
          "Employee authentication required",
          401
        )
      );
    }

    const currentDate = new Date();

    const month =
      Number(req.query.month) ||
      currentDate.getMonth() + 1;

    const year =
      Number(req.query.year) ||
      currentDate.getFullYear();

    if (month < 1 || month > 12) {
      return next(
        new AppError(
          "Month must be between 1 and 12",
          400
        )
      );
    }

    const attendance = await Attendance.findOne({
      employee: employeeId,
      year,
      month,
    })
      .populate(
        "employee",
        "fullName email employeeType"
      )
      .populate(
        "conference",
        "title"
      );

    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: {
          employee: employeeId,
          year,
          month,
          days: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  }
);