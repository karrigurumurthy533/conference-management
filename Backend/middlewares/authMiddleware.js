const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const Role = require("../models/role");
const catchAsync = require("../utils/catchAsync");

const authMiddleware = (...allowedRoles) =>
    catchAsync(async (req, res, next) => {
        let token;

        // ======================================================
        // GET TOKEN
        // ======================================================

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(
                new AppError(
                    "Authentication token is required",
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
                "JWT verification error:",
                error.message
            );

            return next(
                new AppError(
                    "Invalid or expired authentication token",
                    401
                )
            );
        }

        

        // ======================================================
        // GET USER ID
        // ======================================================

        const userId = decoded.id;

        if (!userId) {
            return next(
                new AppError(
                    "User ID missing from authentication token",
                    401
                )
            );
        }

        // ======================================================
        // FIND ADMIN / USER
        // ======================================================

        const user = await Role.findById(userId)
            .select("-password")
            .lean();

        if (!user) {
            return next(
                new AppError(
                    "User associated with this token no longer exists",
                    401
                )
            );
        }

        // ======================================================
        // CHECK STATUS
        // ======================================================

        if (
            user.active !== undefined &&
            user.active === false
        ) {
            return next(
                new AppError(
                    "Your account is inactive",
                    403
                )
            );
        }

        // ======================================================
        // CHECK ROLE
        // ======================================================

        if (allowedRoles.length > 0) {
            const userRole = String(
                user.role || ""
            ).toLowerCase();

            const hasPermission = allowedRoles.some(
                (allowedRole) =>
                    String(allowedRole).toLowerCase() ===
                    userRole
            );

            if (!hasPermission) {
                return next(
                    new AppError(
                        "You are not authorized to access this resource",
                        403
                    )
                );
            }
        }

        // ======================================================
        // SET AUTHENTICATED USER
        // ======================================================

        req.user = user;

        // Existing controllers compatibility
        req.role = user;

        next();
    });

module.exports = authMiddleware;