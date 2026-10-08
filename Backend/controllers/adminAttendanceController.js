const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

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
| ADMIN ATTENDANCE DASHBOARD
|--------------------------------------------------------------------------
| GET /api/v1/admin/attendance/dashboard
|--------------------------------------------------------------------------
*/

exports.getAttendanceDashboard = catchAsync(
  async (req, res, next) => {
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

    const todayStart = getStartOfDay(currentDate);
    const todayEnd = getEndOfDay(currentDate);

    /*
    |--------------------------------------------------------------------------
    | Total Employees
    |--------------------------------------------------------------------------
    */

    const totalEmployees = await Employee.countDocuments({
      status: {
        $ne: "Inactive",
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Current Month Attendance
    |--------------------------------------------------------------------------
    */

    const attendanceRecords =
      await Attendance.find({
        year,
        month,
      }).lean();

    /*
    |--------------------------------------------------------------------------
    | Today Present
    |--------------------------------------------------------------------------
    */

    let todayPresent = 0;

    attendanceRecords.forEach((attendance) => {
      const today = attendance.days?.find((day) => {
        const date = new Date(day.date);

        return (
          date >= todayStart &&
          date <= todayEnd
        );
      });

      if (
        today &&
        today.checkIn &&
        today.status === "Present"
      ) {
        todayPresent++;
      }
    });

    /*
    |--------------------------------------------------------------------------
    | Today Absent
    |--------------------------------------------------------------------------
    */

    const todayAbsent = Math.max(
      totalEmployees - todayPresent,
      0
    );

    /*
    |--------------------------------------------------------------------------
    | This Month Present
    |--------------------------------------------------------------------------
    */

    let monthPresent = 0;

    attendanceRecords.forEach((attendance) => {
      attendance.days?.forEach((day) => {
        if (
          day.status === "Present" &&
          day.checkIn
        ) {
          monthPresent++;
        }
      });
    });

    /*
    |--------------------------------------------------------------------------
    | This Month Absent
    |--------------------------------------------------------------------------
    |
    | Current date varaku elapsed days calculate chestunnam.
    |
    */

    const elapsedDays =
      year === currentDate.getFullYear() &&
      month === currentDate.getMonth() + 1
        ? currentDate.getDate()
        : new Date(year, month, 0).getDate();

    const expectedAttendance =
      totalEmployees * elapsedDays;

    const monthAbsent = Math.max(
      expectedAttendance - monthPresent,
      0
    );

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,

      data: {
        totalEmployees,
        todayPresent,
        todayAbsent,
        monthPresent,
        monthAbsent,
      },
    });
  }
);

/*
|--------------------------------------------------------------------------
| GET ALL EMPLOYEE ATTENDANCE
|--------------------------------------------------------------------------
| GET /api/v1/admin/attendance
|--------------------------------------------------------------------------
*/

exports.getAllAttendance = catchAsync(
  async (req, res, next) => {
    const {
      search = "",
      date = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const currentLimit = Math.max(
      Number(limit) || 10,
      1
    );

    const skip =
      (currentPage - 1) * currentLimit;

    /*
    |--------------------------------------------------------------------------
    | Employee Search
    |--------------------------------------------------------------------------
    */

    let employeeFilter = {};

    if (search.trim()) {
      employeeFilter = {
        $or: [
          {
            fullName: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            email: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            employeeId: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            department: {
              $regex: search.trim(),
              $options: "i",
            },
          },
        ],
      };
    }

    const employees = await Employee.find(
      employeeFilter
    )
      .select(
        "_id fullName email employeeId department employeeType status"
      )
      .lean();

    const employeeIds = employees.map(
      (employee) => employee._id
    );

    /*
    |--------------------------------------------------------------------------
    | Attendance Query
    |--------------------------------------------------------------------------
    */

    const attendanceDocuments =
      await Attendance.find({
        employee: {
          $in: employeeIds,
        },
      })
        .populate(
          "employee",
          "fullName email employeeId department employeeType status"
        )
        .lean();

    /*
    |--------------------------------------------------------------------------
    | Convert Monthly Documents -> Daily Records
    |--------------------------------------------------------------------------
    */

    let records = [];

    attendanceDocuments.forEach(
      (attendance) => {
        if (!attendance.employee) {
          return;
        }

        attendance.days?.forEach((day) => {
          const dayDate = new Date(day.date);

          const formattedDate =
            dayDate.toISOString().split("T")[0];

          /*
          |----------------------------------------------------------------------
          | Date Filter
          |----------------------------------------------------------------------
          */

          if (date && formattedDate !== date) {
            return;
          }

          /*
          |----------------------------------------------------------------------
          | Status Filter
          |----------------------------------------------------------------------
          */

          if (
            status &&
            status !== "All Status" &&
            day.status !== status
          ) {
            return;
          }

          records.push({
            _id:
              `${attendance._id}-${formattedDate}`,

            attendanceId: attendance._id,

            employee: attendance.employee,

            date: day.date,

            checkIn: day.checkIn || null,

            checkOut: day.checkOut || null,

            status: day.status || "Absent",

            workingHours:
              day.workingHours || 0,
          });
        });
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Employees Without Attendance For Selected Date
    |--------------------------------------------------------------------------
    |
    | If date filter is used, employees who didn't
    | mark attendance should also appear as Absent.
    |
    */

    if (date) {
      const existingEmployeeIds = new Set(
        records.map(
          (record) =>
            String(record.employee?._id)
        )
      );

      employees.forEach((employee) => {
        if (
          !existingEmployeeIds.has(
            String(employee._id)
          )
        ) {
          records.push({
            _id: `absent-${employee._id}-${date}`,

            attendanceId: null,

            employee,

            date: new Date(`${date}T00:00:00`),

            checkIn: null,

            checkOut: null,

            status: "Absent",

            workingHours: 0,
          });
        }
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Sort Latest First
    |--------------------------------------------------------------------------
    */

    records.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const total = records.length;

    const paginatedRecords =
      records.slice(
        skip,
        skip + currentLimit
      );

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,

      data: {
        attendance: paginatedRecords,

        pagination: {
          page: currentPage,

          limit: currentLimit,

          total,

          totalPages: Math.ceil(
            total / currentLimit
          ),
        },
      },
    });
  }
);

/*
|--------------------------------------------------------------------------
| GET SINGLE EMPLOYEE ATTENDANCE
|--------------------------------------------------------------------------
| GET /api/v1/admin/attendance/:employeeId
|--------------------------------------------------------------------------
*/

exports.getEmployeeAttendance = catchAsync(
  async (req, res, next) => {
    const { employeeId } = req.params;

    const currentDate = new Date();

    const month =
      Number(req.query.month) ||
      currentDate.getMonth() + 1;

    const year =
      Number(req.query.year) ||
      currentDate.getFullYear();

    const employee =
      await Employee.findById(employeeId)
        .select(
          "_id fullName email employeeId department employeeType status"
        );

    if (!employee) {
      return next(
        new AppError(
          "Employee not found",
          404
        )
      );
    }

    const attendance =
      await Attendance.findOne({
        employee: employeeId,
        year,
        month,
      })
        .populate(
          "employee",
          "fullName email employeeId department employeeType status"
        )
        .populate(
          "conference",
          "title"
        );

    res.status(200).json({
      success: true,

      data:
        attendance || {
          employee,
          year,
          month,
          days: [],
        },
    });
  }
);