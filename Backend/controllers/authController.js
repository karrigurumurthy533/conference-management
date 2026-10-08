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
            employeeType: user.employeeType || undefined,
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

exports.updateProfile = catchAsync(async (req, res, next) => {
    console.log("========== UPDATE PROFILE START ==========");

    console.log("REQ ROLE:", req.role);
    console.log("REQ BODY:", req.body);

    const {
        firstName,
        lastName,
        email,
        phone,
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

    if (!req.role) {
        console.log("REQ ROLE IS MISSING");

        return next(
            new AppError(
                "Authenticated role not found",
                401
            )
        );
    }

    const roleId = req.role._id;

    console.log("ROLE ID:", roleId);

    const user = await Role.findById(roleId);

    console.log("DATABASE USER:", user);

    if (!user) {
        console.log("USER NOT FOUND");

        return next(
            new AppError(
                "User not found",
                404
            )
        );
    }

    if (firstName !== undefined) {
        user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
        user.lastName = lastName.trim();
    }

    if (email !== undefined) {
        const normalizedEmail = email.toLowerCase().trim();

        const existingRole = await Role.findOne({
            email: normalizedEmail,
            _id: { $ne: roleId },
        });

        if (existingRole) {
            return next(
                new AppError(
                    "Email is already registered",
                    409
                )
            );
        }

        user.email = normalizedEmail;
    }

    if (phone !== undefined) {
        user.phone = phone.trim();
    }

    if (department !== undefined) {
        user.department = department.trim();
    }

    if (location !== undefined) {
        user.location = location.trim();
    }

    if (timezone !== undefined) {
        user.timezone = timezone.trim();
    }

    if (about !== undefined) {
        user.about = about.trim();
    }

    if (designation !== undefined) {
        user.designation = designation.trim();
    }

    if (country !== undefined) {
        user.country = country.trim();
    }

    if (assignedConference !== undefined) {
        user.assignedConference = assignedConference || null;
    }

    if (twoFactorEnabled !== undefined) {
        user.twoFactorEnabled = Boolean(twoFactorEnabled);
    }

    if (permissions !== undefined) {
        if (!Array.isArray(permissions)) {
            return next(
                new AppError(
                    "Permissions must be an array",
                    400
                )
            );
        }

        user.permissions = permissions;
    }

    console.log("BEFORE SAVE");

    await user.save();

    console.log("AFTER SAVE");

    const token = generateToken(user);

    console.log("TOKEN GENERATED");

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        token,
        data: {
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

exports.employeeLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

  

    if (!email || !password) {
        return next(
            new AppError(
                "Email and password are required",
                400
            )
        );
    }

    const normalizedEmail = email.trim().toLowerCase();


    const employee = await Employee.findOne({
        email: normalizedEmail,
    })
        .select("+password")
        .populate(
            "assignedConferences",
            "title slug dates location"
        );

   
    if (!employee) {
        return next(
            new AppError(
                "Invalid email or password",
                401
            )
        );
    }

   

    if (employee.role !== "Employee") {
        return next(
            new AppError(
                "Employee access is not allowed",
                403
            )
        );
    }


    if (employee.status !== "active") {
        return next(
            new AppError(
                "Your employee account is inactive",
                403
            )
        );
    }

  

    const isPasswordCorrect =
        await employee.comparePassword(password);

    if (!isPasswordCorrect) {
        return next(
            new AppError(
                "Invalid email or password",
                401
            )
        );
    }


    if (
        !employee.assignedConferences ||
        employee.assignedConferences.length === 0
    ) {
        return next(
            new AppError(
                "No conference has been assigned to this employee",
                403
            )
        );
    }

  

    employee.lastLogin = new Date();

    await employee.save();

 

    const token = generateToken(employee);

  

    return res.status(200).json({
        success: true,
        message: "Employee login successful",
        token,
        user: {
            id: employee._id,
            fullName: employee.fullName,
            email: employee.email,
            role: employee.role,
            employeeType: employee.employeeType,
            phoneNumber: employee.phoneNumber,
            assignedConferences:
                employee.assignedConferences,
            status: employee.status,
            department: employee.department,
            designation: employee.designation,
            country: employee.country,
            location: employee.location,
            timezone: employee.timezone,
            about: employee.about,
            permissions: employee.permissions,
            lastLogin: employee.lastLogin,
        },
    });
});

exports.employeeLogout = catchAsync(async (req, res, next) => {
    // Employee ID can come from authenticated user
    const employeeId =
        req.user?._id ||
        req.user?.id ||
        req.role?._id ||
        req.role?.id;

    // -------------------------------------------------
    // If employee ID is available, update lastLogout
    // -------------------------------------------------

    if (employeeId) {
        const employee = await Employee.findById(employeeId);

        if (employee) {
            employee.lastLogout = new Date();

            await employee.save();
        }
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
        success: true,
        message: "Employee logout successful",
    });
});

