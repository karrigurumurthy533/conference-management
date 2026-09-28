const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");


const Role = require("../models/role");
const catchAsync = require("../utils/catchAsync");

const authMiddleware = (...allowedRoles) =>
  catchAsync(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("Authentication token is required", 401)
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(
        new AppError("Invalid or expired authentication token", 401)
      );
    }

    const role = await Role.findById(decoded.id).select("-password");

    if (!role) {
      return next(
        new AppError(
          "Account associated with this token no longer exists",
          401
        )
      );
    }

    if (!role.active) {
      return next(
        new AppError("Your account is inactive", 403)
      );
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(role.role)
    ) {
      return next(
        new AppError(
          "You are not authorized to access this resource",
          403
        )
      );
    }

    req.role = role;

    next();
  });

module.exports = authMiddleware;