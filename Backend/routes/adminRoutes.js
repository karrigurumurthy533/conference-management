const express = require("express");

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");

const {
    createConferenceValidation,
} = require("../validations/adminValidations");

const { validationResult } = require("express-validator");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};

router.post(
    "/conference",
    authMiddleware("admin"),
    createConferenceValidation,
    handleValidation,
    adminController.createConference
);

router.get(
    "/conferences",
    authMiddleware("admin"),
    adminController.getAllConferences
);

router.get(
    "/conference/:conferenceId",
    authMiddleware("admin"),
    adminController.getConferenceById
);

router.delete(
    "/conference/:conferenceId",
    authMiddleware("admin"),
    adminController.deleteConference
);

router.put(
    "/conference/:conferenceId",
    authMiddleware("admin"),
    adminController.updateConference
);

router.post(
    "/employee",
    authMiddleware("admin"),
    adminController.createEmployee
);

router.get(
    "/employees",
    authMiddleware("admin"),
    adminController.getAllEmployees
);

router.get(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.getEmployeeById
);

router.put(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.updateEmployee
);

router.delete(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.deleteEmployee
);

module.exports = router;