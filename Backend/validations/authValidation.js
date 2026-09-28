const { body } = require("express-validator");

const validateRegister = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["admin", "employee"])
        .withMessage("Role must be either admin or employee"),

    body("phone")
        .optional()
        .trim(),

    body("department")
        .optional()
        .trim(),

    body("location")
        .optional()
        .trim(),

    body("timezone")
        .optional()
        .trim(),

    body("about")
        .optional()
        .trim(),

    body("designation")
        .optional()
        .trim(),

    body("country")
        .optional()
        .trim(),

    body("assignedConference")
        .optional()
        .isMongoId()
        .withMessage("Invalid conference ID"),

    body("twoFactorEnabled")
        .optional()
        .isBoolean()
        .withMessage("Two-factor authentication must be true or false"),

    body("permissions")
        .optional()
        .isArray()
        .withMessage("Permissions must be an array"),
];

const validateLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = {
    validateRegister,
    validateLogin,
};