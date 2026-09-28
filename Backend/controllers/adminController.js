const Conference = require("../models/conference");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createConference = catchAsync(async (req, res, next) => {
    const {
        basicInformation,
        conferenceDates,
        venueInformation,
        registrationTypes,
        submissionSettings,
        conferenceTopics,
        speakers,
        organizingCommittee,
        conferenceProgram,
        conferenceMedia,
        contactInformation,
        socialMedia,
        slug,
    } = req.body;

    if (
        !basicInformation ||
        !basicInformation.conferenceName ||
        !basicInformation.shortName ||
        !basicInformation.category
    ) {
        return next(
            new AppError(
                "Conference name, short name and category are required",
                400
            )
        );
    }

    if (
        !conferenceDates ||
        !conferenceDates.startDate ||
        !conferenceDates.endDate
    ) {
        return next(
            new AppError(
                "Conference start date and end date are required",
                400
            )
        );
    }

    if (
        new Date(conferenceDates.endDate) <
        new Date(conferenceDates.startDate)
    ) {
        return next(
            new AppError(
                "Conference end date cannot be before start date",
                400
            )
        );
    }

    const existingConference = await Conference.findOne({
        $or: [
            {
                "basicInformation.conferenceName":
                    basicInformation.conferenceName.trim(),
            },
            {
                "basicInformation.shortName":
                    basicInformation.shortName.trim(),
            },
            ...(slug
                ? [
                      {
                          slug: slug.toLowerCase().trim(),
                      },
                  ]
                : []),
        ],
    });

    if (existingConference) {
        return next(
            new AppError(
                "Conference with the same name, short name or slug already exists",
                409
            )
        );
    }

    const conference = await Conference.create({
        basicInformation: {
            conferenceName:
                basicInformation.conferenceName.trim(),

            shortName:
                basicInformation.shortName.trim(),

            category:
                basicInformation.category.trim(),

            conferenceType:
                basicInformation.conferenceType || "Physical",

            status:
                basicInformation.status || "Draft",

            conferenceDescription:
                basicInformation.conferenceDescription || "",
        },

        conferenceDates: {
            startDate: conferenceDates.startDate,

            endDate: conferenceDates.endDate,

            registrationStartDate:
                conferenceDates.registrationStartDate || null,

            registrationDeadline:
                conferenceDates.registrationDeadline || null,

            abstractSubmissionDeadline:
                conferenceDates.abstractSubmissionDeadline || null,

            fullPaperSubmissionDeadline:
                conferenceDates.fullPaperSubmissionDeadline || null,

            timeZone:
                conferenceDates.timeZone || "Asia/Kolkata",
        },

        venueInformation:
            venueInformation || {},

        registrationTypes:
            Array.isArray(registrationTypes)
                ? registrationTypes
                : [],

        submissionSettings:
            submissionSettings || {},

        conferenceTopics:
            Array.isArray(conferenceTopics)
                ? conferenceTopics
                : [],

        speakers:
            Array.isArray(speakers)
                ? speakers
                : [],

        organizingCommittee:
            Array.isArray(organizingCommittee)
                ? organizingCommittee
                : [],

        conferenceProgram:
            Array.isArray(conferenceProgram)
                ? conferenceProgram
                : [],

        conferenceMedia:
            conferenceMedia || {},

        contactInformation:
            contactInformation || {},

        socialMedia:
            socialMedia || {},

        slug: slug
            ? slug.toLowerCase().trim()
            : basicInformation.shortName
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, ""),
    });

    res.status(201).json({
        success: true,
        message: "Conference created successfully",
        data: conference,
    });
});

exports.getAllConferences = catchAsync(async (req, res, next) => {
    const conferences = await Conference.find()
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Conferences fetched successfully",
        count: conferences.length,
        data: conferences,
    });
});

exports.updateConference = catchAsync(async (req, res, next) => {
    const { conferenceId } = req.params;

    const conference = await Conference.findById(conferenceId);

    if (!conference) {
        return next(
            new AppError(
                "Conference not found",
                404
            )
        );
    }

    const {
        basicInformation,
        conferenceDates,
        venueInformation,
        registrationTypes,
        submissionSettings,
        conferenceTopics,
        speakers,
        organizingCommittee,
        conferenceProgram,
        conferenceMedia,
        contactInformation,
        socialMedia,
        slug,
    } = req.body;

    if (basicInformation) {
        if (basicInformation.conferenceName !== undefined) {
            conference.basicInformation.conferenceName =
                basicInformation.conferenceName.trim();
        }

        if (basicInformation.shortName !== undefined) {
            conference.basicInformation.shortName =
                basicInformation.shortName.trim();
        }

        if (basicInformation.category !== undefined) {
            conference.basicInformation.category =
                basicInformation.category.trim();
        }

        if (basicInformation.conferenceType !== undefined) {
            conference.basicInformation.conferenceType =
                basicInformation.conferenceType;
        }

        if (basicInformation.status !== undefined) {
            conference.basicInformation.status =
                basicInformation.status;
        }

        if (
            basicInformation.conferenceDescription !==
            undefined
        ) {
            conference.basicInformation.conferenceDescription =
                basicInformation.conferenceDescription;
        }
    }

    if (conferenceDates) {
        if (conferenceDates.startDate !== undefined) {
            conference.conferenceDates.startDate =
                conferenceDates.startDate;
        }

        if (conferenceDates.endDate !== undefined) {
            conference.conferenceDates.endDate =
                conferenceDates.endDate;
        }

        if (
            conferenceDates.registrationStartDate !==
            undefined
        ) {
            conference.conferenceDates.registrationStartDate =
                conferenceDates.registrationStartDate;
        }

        if (
            conferenceDates.registrationDeadline !==
            undefined
        ) {
            conference.conferenceDates.registrationDeadline =
                conferenceDates.registrationDeadline;
        }

        if (
            conferenceDates.abstractSubmissionDeadline !==
            undefined
        ) {
            conference.conferenceDates.abstractSubmissionDeadline =
                conferenceDates.abstractSubmissionDeadline;
        }

        if (
            conferenceDates.fullPaperSubmissionDeadline !==
            undefined
        ) {
            conference.conferenceDates.fullPaperSubmissionDeadline =
                conferenceDates.fullPaperSubmissionDeadline;
        }

        if (conferenceDates.timeZone !== undefined) {
            conference.conferenceDates.timeZone =
                conferenceDates.timeZone;
        }
    }

    if (venueInformation !== undefined) {
        conference.venueInformation =
            venueInformation;
    }

    if (registrationTypes !== undefined) {
        conference.registrationTypes =
            registrationTypes;
    }

    if (submissionSettings !== undefined) {
        conference.submissionSettings =
            submissionSettings;
    }

    if (conferenceTopics !== undefined) {
        conference.conferenceTopics =
            conferenceTopics;
    }

    if (speakers !== undefined) {
        conference.speakers = speakers;
    }

    if (organizingCommittee !== undefined) {
        conference.organizingCommittee =
            organizingCommittee;
    }

    if (conferenceProgram !== undefined) {
        conference.conferenceProgram =
            conferenceProgram;
    }

    if (conferenceMedia !== undefined) {
        conference.conferenceMedia =
            conferenceMedia;
    }

    if (contactInformation !== undefined) {
        conference.contactInformation =
            contactInformation;
    }

    if (socialMedia !== undefined) {
        conference.socialMedia =
            socialMedia;
    }

    if (slug !== undefined) {
        conference.slug = slug
            .toLowerCase()
            .trim();
    }

    await conference.save();

    res.status(200).json({
        success: true,
        message: "Conference updated successfully",
        data: conference,
    });
});

exports.getConferenceById = catchAsync(async (req, res, next) => {
    const { conferenceId } = req.params;

    const conference = await Conference.findById(conferenceId);

    if (!conference) {
        return next(
            new AppError(
                "Conference not found",
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        message: "Conference fetched successfully",
        data: conference,
    });
});

exports.deleteConference = catchAsync(async (req, res, next) => {
    const { conferenceId } = req.params;

    const conference = await Conference.findById(conferenceId);

    if (!conference) {
        return next(
            new AppError(
                "Conference not found",
                404
            )
        );
    }

    await Conference.findByIdAndDelete(conferenceId);

    res.status(200).json({
        success: true,
        message: "Conference deleted successfully",
    });
});

exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      role,
      phoneNumber,
      assignedConferences = [],
    } = req.body;

    

    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and role are required.",
      });
    }

   

    const normalizedEmail = email.trim().toLowerCase();

 

    const existingEmployee = await Employee.findOne({
      email: normalizedEmail,
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists.",
      });
    }

    
    if (!Array.isArray(assignedConferences)) {
      return res.status(400).json({
        success: false,
        message: "assignedConferences must be an array.",
      });
    }

   

    for (const conferenceId of assignedConferences) {
      if (!mongoose.Types.ObjectId.isValid(conferenceId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid conference ID: ${conferenceId}`,
        });
      }
    }

   

    if (assignedConferences.length > 0) {
      const conferences = await Conference.find({
        _id: {
          $in: assignedConferences,
        },
      }).select("_id");

      if (conferences.length !== assignedConferences.length) {
        return res.status(404).json({
          success: false,
          message: "One or more assigned conferences were not found.",
        });
      }
    }

    
    const employee = await Employee.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      role,
      phoneNumber: phoneNumber?.trim() || "",
      assignedConferences,
    });

   

    const populatedEmployee = await Employee.findById(
      employee._id
    ).populate(
      "assignedConferences",
      "basicInformation conferenceDates venueInformation"
    );

   

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: populatedEmployee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee.",
      error: error.message,
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate(
        "assignedConferences",
        "basicInformation conferenceDates venueInformation"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees.",
      error: error.message,
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

   

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

   

    const employee = await Employee.findById(id).populate(
      "assignedConferences",
      "basicInformation conferenceDates venueInformation"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

  

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee.",
      error: error.message,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      email,
      role,
      phoneNumber,
      assignedConferences,
      status,
    } = req.body;

  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

   
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

   

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      const emailExists = await Employee.findOne({
        email: normalizedEmail,
        _id: {
          $ne: id,
        },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Another employee already uses this email.",
        });
      }

      employee.email = normalizedEmail;
    }

  
    if (fullName !== undefined) {
      employee.fullName = fullName.trim();
    }

    

    if (role !== undefined) {
      employee.role = role;
    }

    

    if (phoneNumber !== undefined) {
      employee.phoneNumber = phoneNumber.trim();
    }

    

    if (status !== undefined) {
      employee.status = status;
    }

   

    if (assignedConferences !== undefined) {
      // Check array
      if (!Array.isArray(assignedConferences)) {
        return res.status(400).json({
          success: false,
          message: "assignedConferences must be an array.",
        });
      }

      
      for (const conferenceId of assignedConferences) {
        if (!mongoose.Types.ObjectId.isValid(conferenceId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid conference ID: ${conferenceId}`,
          });
        }
      }

      
      if (assignedConferences.length > 0) {
        const conferences = await Conference.find({
          _id: {
            $in: assignedConferences,
          },
        }).select("_id");

        if (conferences.length !== assignedConferences.length) {
          return res.status(404).json({
            success: false,
            message: "One or more assigned conferences were not found.",
          });
        }
      }

      employee.assignedConferences = assignedConferences;
    }

   

    await employee.save();

   

    const updatedEmployee = await Employee.findById(
      employee._id
    ).populate(
      "assignedConferences",
      "basicInformation conferenceDates venueInformation"
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee.",
      error: error.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // CHECK EMPLOYEE ID
    // -------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    // -------------------------------------------------
    // FIND EMPLOYEE
    // -------------------------------------------------

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // -------------------------------------------------
    // DELETE EMPLOYEE
    // -------------------------------------------------

    await Employee.findByIdAndDelete(id);

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee.",
      error: error.message,
    });
  }
};