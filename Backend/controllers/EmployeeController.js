const Employee = require("../models/Employee");
const Speaker = require("../models/Speaker");
const bcrypt = require("bcryptjs");

const Abstract = require("../models/Abstract");
const Registration = require("../models/Registration");
const Conference = require("../models/conference");
const DownloadBrochure = require("../models/DownloadBrochure");
const { sendEmployeeCredentials } = require("../utils/emailService");



const getEmployeeConferenceIds = async (employeeId) => {
    const employee = await Employee.findById(employeeId)
        .select("assignedConferences")
        .lean();

    if (!employee) {
        throw new Error("Employee not found");
    }

    return employee.assignedConferences || [];
};



exports.getMyConference = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const conferences = await Conference.find({
            _id: { $in: conferenceIds },
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: conferences,
            count: conferences.length,
        });
    } catch (error) {
        console.error("getMyConference error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch conferences",
        });
    }
};



exports.getMySpeakers = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const speakers = await Speaker.find({
            conferenceId: { $in: conferenceIds },
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: speakers,
            count: speakers.length,
        });
    } catch (error) {
        console.error("getMySpeakers error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch speakers",
        });
    }
};



exports.getMyBrochures = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const brochures = await DownloadBrochure.find({
            conferenceId: { $in: conferenceIds },
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: brochures,
            count: brochures.length,
        });
    } catch (error) {
        console.error("getMyBrochures error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch brochures",
        });
    }
};



exports.getMyRegistrations = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const registrations = await Registration.find({
            "conference.conferenceId": {
                $in: conferenceIds,
            },
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: registrations,
            count: registrations.length,
        });
    } catch (error) {
        console.error("getMyRegistrations error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to fetch registrations",
        });
    }
};



exports.getMyAbstracts = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const abstracts = await Abstract.find({
            "abstractDetails.conferenceId": {
                $in: conferenceIds,
            },
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: abstracts,
            count: abstracts.length,
        });
    } catch (error) {
        console.error("getMyAbstracts error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch abstracts",
        });
    }
};


exports.getEmployeeDashboard = async (req, res) => {
    try {
        const employeeId = req.role?._id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: "Employee authentication required",
            });
        }

        const conferenceIds =
            await getEmployeeConferenceIds(employeeId);

        const [
            registrations,
            speakers,
            abstracts,
            brochures,
            latestRegistration,
            latestSpeaker,
            latestAbstract,
            latestBrochure,
        ] = await Promise.all([
            // =====================================================
            // COUNTS
            // =====================================================

            Registration.countDocuments({
                "conference.conferenceId": {
                    $in: conferenceIds,
                },
            }),

            Speaker.countDocuments({
                conferenceId: {
                    $in: conferenceIds,
                },
            }),

            Abstract.countDocuments({
                "abstractDetails.conferenceId": {
                    $in: conferenceIds,
                },
            }),

            DownloadBrochure.countDocuments({
                conferenceId: {
                    $in: conferenceIds,
                },
            }),

            // =====================================================
            // LATEST REGISTRATION - ONLY 1
            // =====================================================

            Registration.findOne({
                "conference.conferenceId": {
                    $in: conferenceIds,
                },
            })
                .sort({ createdAt: -1 })
                .lean(),

            // =====================================================
            // LATEST SPEAKER - ONLY 1
            // =====================================================

            Speaker.findOne({
                conferenceId: {
                    $in: conferenceIds,
                },
            })
                .sort({ createdAt: -1 })
                .lean(),

            // =====================================================
            // LATEST ABSTRACT - ONLY 1
            // =====================================================

            Abstract.findOne({
                "abstractDetails.conferenceId": {
                    $in: conferenceIds,
                },
            })
                .sort({ createdAt: -1 })
                .lean(),

            // =====================================================
            // LATEST BROCHURE - ONLY 1
            // =====================================================

            DownloadBrochure.findOne({
                conferenceId: {
                    $in: conferenceIds,
                },
            })
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        // =========================================================
        // LATEST ACTIVITY
        // =========================================================

        const latestActivity = [];

        // ---------------------------------------------------------
        // REGISTRATION
        // ---------------------------------------------------------

        if (latestRegistration) {
            latestActivity.push({
                type: "registration",
                title: "New Registration",
                description: `${latestRegistration.firstName || ""} ${
                    latestRegistration.lastName || ""
                } registered for ${
                    latestRegistration.conference?.title ||
                    latestRegistration.conference?.conferenceTitle ||
                    "conference"
                }`.trim(),
                data: latestRegistration,
                createdAt: latestRegistration.createdAt,
            });
        }

        // ---------------------------------------------------------
        // SPEAKER
        // ---------------------------------------------------------

        if (latestSpeaker) {
            latestActivity.push({
                type: "speaker",
                title: "New Speaker",
                description: `${
                    latestSpeaker.fullName ||
                    latestSpeaker.name ||
                    "A new speaker"
                } added to conference`,
                data: latestSpeaker,
                createdAt: latestSpeaker.createdAt,
            });
        }

        // ---------------------------------------------------------
        // ABSTRACT
        // ---------------------------------------------------------

        if (latestAbstract) {
            latestActivity.push({
                type: "abstract",
                title: "New Abstract Submission",
                description: `${
                    latestAbstract.presenter?.firstName || ""
                } ${
                    latestAbstract.presenter?.lastName || ""
                } submitted an abstract`.trim(),
                data: latestAbstract,
                createdAt: latestAbstract.createdAt,
            });
        }

        // ---------------------------------------------------------
        // BROCHURE
        // ---------------------------------------------------------

        if (latestBrochure) {
            latestActivity.push({
                type: "brochure",
                title: "Brochure Downloaded",
                description: `${
                    latestBrochure.fullName || "A user"
                } downloaded the conference brochure`,
                data: latestBrochure,
                createdAt: latestBrochure.createdAt,
            });
        }

        // =========================================================
        // SORT BY LATEST CREATED DATE
        // =========================================================

        latestActivity.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        // =========================================================
        // RESPONSE
        // =========================================================

        return res.status(200).json({
            success: true,
            data: {
                totalRegistrations: registrations,
                totalSpeakers: speakers,
                totalAbstracts: abstracts,
                totalBrochures: brochures,
                totalConferences: conferenceIds.length,
                latestActivity,
            },
        });
    } catch (error) {
        console.error(
            "getEmployeeDashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch employee dashboard",
        });
    }
};



exports.sendEmployeeEmail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    const employee = await Employee.findById(id).select(
      "fullName email employeeType"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (!employee.email) {
      return res.status(400).json({
        success: false,
        message: "Employee email not found.",
      });
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(500).json({
        success: false,
        message: "SMTP configuration is incomplete.",
      });
    }

    const loginUrl = process.env.EMPLOYEE_LOGIN_URL;

    if (!loginUrl) {
      return res.status(500).json({
        success: false,
        message: "Employee login URL is not configured.",
      });
    }

    await sendEmployeeCredentials({
      name: employee.fullName,
      email: employee.email,
      employeeType: employee.employeeType,
      password: "Employee@123",
      loginUrl,
    });

    return res.status(200).json({
      success: true,
      message: `Email sent successfully to ${employee.email}`,
    });
  } catch (error) {
    // Detailed error stays in server logs, not in the public API response.
    console.error("Employee email delivery failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    });

    const isTimeout = [
      "ETIMEDOUT",
      "ESOCKET",
      "ECONNECTION",
      "ENETUNREACH",
    ].includes(error.code);

    return res.status(isTimeout ? 503 : 500).json({
      success: false,
      message: isTimeout
        ? "Email service is temporarily unreachable. Please try again."
        : "Email sending failed. Please check the email configuration.",
      errorCode: error.code || "EMAIL_SEND_FAILED",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Authentication middleware req.role lo employee document/id set chestundani assume chestunnam.
    const employeeId =
      req.role?._id || req.employee?._id || req.user?._id;

    const { newPassword, confirmPassword } = req.body;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Employee authentication required.",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const employee = await Employee.findById(employeeId)
      .select("+password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Employee model pre-save middleware password-ni hash chesthe,
    // ikkada bcrypt.hash() malli call cheyyakandi.
    employee.password = newPassword;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("changePassword error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};
