const Employee = require("../models/Employee");
const Speaker = require("../models/Speaker");

const Abstract = require("../models/Abstract");
const Registration = require("../models/Registration");
const Conference = require("../models/conference");
const DownloadBrochure = require("../models/DownloadBrochure");



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
        ] = await Promise.all([
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
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalRegistrations: registrations,
                totalSpeakers: speakers,
                totalAbstracts: abstracts,
                totalBrochures: brochures,
                totalConferences: conferenceIds.length,
            },
        });
    } catch (error) {
        console.error("getEmployeeDashboard error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to fetch employee dashboard",
        });
    }
};