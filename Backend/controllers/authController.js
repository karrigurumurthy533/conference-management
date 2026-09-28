const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Role = require("../models/role");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Employee = require("../models/Employee");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

exports.register = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        department,
        location,
        timezone,
        about,
        designation,
        country,
        assignedConference,
        twoFactorEnabled,
        permissions,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !role
    ) {
        return next(
            new AppError(
                "First name, last name, email, password and role are required",
                400
            )
        );
    }

    if (!["admin", "employee"].includes(role.toLowerCase())) {
        return next(
            new AppError(
                "Role must be either admin or employee",
                400
            )
        );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role.toLowerCase().trim();

    const existingRole = await Role.findOne({
        email: normalizedEmail,
    });

    if (existingRole) {
        return next(
            new AppError("Email is already registered", 409)
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const roleData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : undefined,
        role: normalizedRole,
        active: true,
        verificationStatus: "verified",
        department: department ? department.trim() : undefined,
        location: location ? location.trim() : undefined,
        timezone: timezone ? timezone.trim() : "Asia/Kolkata",
        about: about ? about.trim() : undefined,
        designation: designation ? designation.trim() : undefined,
        country: country ? country.trim() : undefined,
        assignedConference: assignedConference || null,
        twoFactorEnabled:
            typeof twoFactorEnabled === "boolean"
                ? twoFactorEnabled
                : false,
        permissions: Array.isArray(permissions)
            ? permissions
            : [],
    };

    const newRole = await Role.create(roleData);

    const token = generateToken(newRole);

    res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        data: {
            id: newRole._id,
            firstName: newRole.firstName,
            lastName: newRole.lastName,
            email: newRole.email,
            phone: newRole.phone,
            role: newRole.role,
            department: newRole.department,
            location: newRole.location,
            timezone: newRole.timezone,
            about: newRole.about,
            designation: newRole.designation,
            country: newRole.country,
            assignedConference: newRole.assignedConference,
            active: newRole.active,
            verificationStatus: newRole.verificationStatus,
            twoFactorEnabled: newRole.twoFactorEnabled,
            permissions: newRole.permissions,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError(
                "Email and password are required",
                400
            )
        );
    }

    const user = await Role.findOne({
        email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
        return next(
            new AppError(
                "Invalid email or password",
                401
            )
        );
    }

    if (!user.active) {
        return next(
            new AppError(
                "Your account is inactive",
                403
            )
        );
    }

    if (!["admin", "employee"].includes(user.role)) {
        return next(
            new AppError(
                "Invalid account role",
                403
            )
        );
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return next(
            new AppError(
                "Invalid email or password",
                401
            )
        );
    }

    user.lastLogin = new Date();

    await user.save();

    const token = generateToken(user);

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            department: user.department,
            location: user.location,
            timezone: user.timezone,
            about: user.about,
            designation: user.designation,
            country: user.country,
            assignedConference: user.assignedConference,
            active: user.active,
            verificationStatus: user.verificationStatus,
            twoFactorEnabled: user.twoFactorEnabled,
            permissions: user.permissions,
            lastLogin: user.lastLogin,
        },
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});