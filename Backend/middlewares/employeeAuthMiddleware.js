const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Employee = require("../models/Employee");

const employeeAuthMiddleware = catchAsync(
  async (req, res, next) => {
    try {
      // ======================================================
      // GET TOKEN
      // ======================================================

      let token;

      const authHeader = req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader.split(" ")[1];
      }

      if (!token) {
        return next(
          new AppError(
            "Employee authentication token is required",
            401
          )
        );
      }

      // ======================================================
      // VERIFY TOKEN
      // ======================================================

      let decoded;

      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );
      } catch (error) {
        console.error(
          "Employee JWT Error:",
          error.message
        );

        return next(
          new AppError(
            "Invalid or expired employee authentication token",
            401
          )
        );
      }

      // ======================================================
      // CHECK TOKEN ID
      // ======================================================

      if (!decoded || !decoded.id) {
        return next(
          new AppError(
            "Employee ID is missing from authentication token",
            401
          )
        );
      }

      console.log(
        "Employee Token Decoded ID:",
        decoded.id
      );

      // ======================================================
      // FIND EMPLOYEE
      // ======================================================

      const employee =
        await Employee.findById(decoded.id).select(
          "-password"
        );

      if (!employee) {
        return next(
          new AppError(
            "Employee associated with this token no longer exists",
            401
          )
        );
      }

      // ======================================================
      // CHECK STATUS
      // ======================================================

      if (
        employee.status &&
        employee.status.toLowerCase() !== "active"
      ) {
        return next(
          new AppError(
            "Employee account is inactive",
            403
          )
        );
      }

      // ======================================================
      // CHECK ROLE
      // ======================================================

      if (
        !employee.role ||
        employee.role.toLowerCase() !== "employee"
      ) {
        return next(
          new AppError(
            "You are not authorized as an employee",
            403
          )
        );
      }

      // ======================================================
      // ATTACH EMPLOYEE
      // ======================================================

      req.employee = employee;

      // Compatibility with existing controller
      req.user = employee;

      // Compatibility with other existing code
      req.role = employee;

      console.log(
        "EMPLOYEE AUTH SUCCESS"
      );

      console.log(
        "Employee ID:",
        employee._id.toString()
      );

      console.log(
        "Employee Role:",
        employee.role
      );

      console.log(
        "Employee Status:",
        employee.status
      );

      next();
    } catch (error) {
      console.error(
        "Employee Authentication Error:",
        error
      );

      return next(
        new AppError(
          "Employee authentication failed",
          401
        )
      );
    }
  }
);

module.exports = employeeAuthMiddleware;