const express = require("express");

const employeeController = require("../controllers/EmployeeController");
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

module.exports = router;