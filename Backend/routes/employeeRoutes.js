const express = require("express");

const employeeController = require("../controllers/EmployeeController");

const employeeAttendanceController = require("../controllers/employeeAttendanceController");
const employeeAuthMiddleware = require("../middlewares/employeeAuthMiddleware");


const router = express.Router();



router.get(
    "/my-conference",
    employeeAuthMiddleware,
    employeeController.getMyConference
);

// ======================================================
// EMPLOYEE SPEAKERS
// GET /api/v1/employee/speakers
// ======================================================

router.get(
    "/speakers",
    employeeAuthMiddleware,
    employeeController.getMySpeakers
);

// ======================================================
// EMPLOYEE BROCHURES
// GET /api/v1/employee/brochures
// ======================================================

router.get(
    "/brochures",
    employeeAuthMiddleware,
    employeeController.getMyBrochures
);

// ======================================================
// EMPLOYEE REGISTRATIONS
// GET /api/v1/employee/registrations
// ======================================================

router.get(
    "/registrations",
    employeeAuthMiddleware,
    employeeController.getMyRegistrations
);

// ======================================================
// EMPLOYEE ABSTRACTS
// GET /api/v1/employee/abstracts
// ======================================================

router.get(
    "/abstracts",
    employeeAuthMiddleware,
    employeeController.getMyAbstracts
);

// ======================================================
// EMPLOYEE DASHBOARD
// GET /api/v1/employee/dashboard
// ======================================================

router.get(
    "/dashboard",
    employeeAuthMiddleware,
    employeeController.getEmployeeDashboard
);





/*
|--------------------------------------------------------------------------
| Employee Attendance Routes
|--------------------------------------------------------------------------
*/

/*
 * Clock In
 * POST /api/employee-attendance/clock-in
 */
router.post(
  "/clock-in",
  employeeAuthMiddleware,
  employeeAttendanceController.clockIn
);

/*
 * Clock Out
 * POST /api/employee-attendance/clock-out
 */
router.post(
  "/clock-out",
  employeeAuthMiddleware,
  employeeAttendanceController.clockOut
);

/*
 * Get Today's Attendance
 * GET /api/employee-attendance/today
 */
router.get(
  "/today",
  employeeAuthMiddleware,
  employeeAttendanceController.getTodayAttendance
);

/*
 * Get Monthly Attendance
 * GET /api/employee-attendance/monthly?month=10&year=2026
 */
router.get(
  "/monthly",
  employeeAuthMiddleware,
  employeeAttendanceController.getMonthlyAttendance
);



module.exports = router;