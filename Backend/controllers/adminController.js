const Conference = require("../models/conference");
const mongoose = require("mongoose");


const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync")
const Speaker = require("../models/Speaker");
const DownloadBrochure = require("../models/DownloadBrochure");
const Employee = require("../models/Employee");
const ConferenceBrochure = require("../models/ConferenceBrochure");
const bcrypt = require("bcryptjs");
const Review = require("../models/review");

const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");
const BankAccount = require("../models/BankAccount");
const { sendEmployeeCredentials } = require("../utils/emailService");



const parseConferenceData = (req) => {
  let data = req.body?.conferenceData;

  if (!data) {
    data = req.body?.data;
  }

  if (!data) {
    data = req.body;
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      throw new Error("Invalid conference JSON data");
    }
  }

  return data;
};

exports.createConference = async (req, res) => {
  try {
    const data = parseConferenceData(req);

    if (!data.title) {
      return res.status(400).json({
        success: false,
        message: "Conference title is required",
      });
    }

    if (!data.category) {
      return res.status(400).json({
        success: false,
        message: "Conference category is required",
      });
    }

    const files = req.files || [];

    const heroImage = files.find(
      (file) => file.fieldname === "conferenceImage"
    );

    if (heroImage) {
      const result = await uploadToCloudinary(
        heroImage,
        "globalscion/conferences/hero"
      );

      data.image = result.secure_url;
    }

    const aboutImage = files.find(
      (file) => file.fieldname === "aboutImage"
    );

    if (aboutImage) {
      const result = await uploadToCloudinary(
        aboutImage,
        "globalscion/conferences/about"
      );

      data.aboutImage = result.secure_url;
    }

    const marketImage = files.find(
      (file) => file.fieldname === "marketImage"
    );

    if (marketImage) {
      if (!data.otherData) {
        data.otherData = {};
      }

      if (!data.otherData.marketAnalysis) {
        data.otherData.marketAnalysis = {};
      }

      const result = await uploadToCloudinary(
        marketImage,
        "globalscion/conferences/market"
      );

      data.otherData.marketAnalysis.image =
        result.secure_url;
    }

    if (Array.isArray(data.speakers)) {
      for (
        let index = 0;
        index < data.speakers.length;
        index++
      ) {
        const speakerFile = files.find(
          (file) =>
            file.fieldname === `speakerImage_${index}`
        );

        if (speakerFile) {
          const result = await uploadToCloudinary(
            speakerFile,
            "globalscion/conferences/speakers"
          );

          data.speakers[index].image =
            result.secure_url;
        }
      }
    }

    if (Array.isArray(data.committee)) {
      for (
        let index = 0;
        index < data.committee.length;
        index++
      ) {
        const committeeFile = files.find(
          (file) =>
            file.fieldname ===
            `committeeImage_${index}`
        );

        if (committeeFile) {
          const result = await uploadToCloudinary(
            committeeFile,
            "globalscion/conferences/committee"
          );

          data.committee[index].image =
            result.secure_url;
        }
      }
    }

    const sponsorFiles = files.filter((file) =>
      file.fieldname.startsWith("sponsorImage_")
    );

    if (sponsorFiles.length > 0) {
      data.sponsors = Array.isArray(data.sponsors)
        ? data.sponsors
        : [];

      for (const file of sponsorFiles) {
        const result = await uploadToCloudinary(
          file,
          "globalscion/conferences/sponsors"
        );

        const index = Number(
          file.fieldname.replace(
            "sponsorImage_",
            ""
          )
        );

        data.sponsors[index] =
          result.secure_url;
      }

      data.sponsors =
        data.sponsors.filter(Boolean);
    }

    const conference =
      await Conference.create({
        ...data,
        createdBy:
          req.user?._id || null,
      });

    return res.status(201).json({
      success: true,
      message:
        "Conference created successfully",
      data: conference,
    });
  } catch (error) {
    console.error(
      "Create conference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create conference",
    });
  }
};

exports.getAllConferences = async (
  req,
  res
) => {
  try {
    const conferences =
      await Conference.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: conferences.length,
      data: conferences,
    });
  } catch (error) {
    console.error(
      "Get conferences error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch conferences",
    });
  }
};

exports.getConferenceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Conference ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conference ID",
      });
    }

    const conference = await Conference.findById(id).lean();

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conference fetched successfully",
      data: conference,
    });
  } catch (error) {
    console.error("Get Conference By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conference",
      error: error.message,
    });
  }
};

exports.updateConference = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Conference ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid conference ID",
      });
    }

    const data =
      parseConferenceData(req);

    const conference =
      await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message:
          "Conference not found",
      });
    }

    const files = req.files || [];

    const heroImage = files.find(
      (file) =>
        file.fieldname === "heroImage" ||
        file.fieldname ===
        "conferenceImage"
    );

    if (heroImage) {
      if (conference.image) {
        await deleteFromCloudinary(
          conference.image
        );
      }

      const result =
        await uploadToCloudinary(
          heroImage,
          "globalscion/conferences/hero"
        );

      data.image =
        result.secure_url;
    } else {
      data.image =
        conference.image;
    }

    const aboutImage = files.find(
      (file) =>
        file.fieldname === "aboutImage"
    );

    if (aboutImage) {
      if (conference.aboutImage) {
        await deleteFromCloudinary(
          conference.aboutImage
        );
      }

      const result =
        await uploadToCloudinary(
          aboutImage,
          "globalscion/conferences/about"
        );

      data.aboutImage =
        result.secure_url;
    } else {
      data.aboutImage =
        conference.aboutImage;
    }

    const marketImage = files.find(
      (file) =>
        file.fieldname === "marketImage"
    );

    if (!data.otherData) {
      data.otherData = {};
    }

    if (!data.otherData.marketAnalysis) {
      data.otherData.marketAnalysis =
        {};
    }

    if (marketImage) {
      const oldMarketImage =
        conference.otherData
          ?.marketAnalysis?.image;

      if (oldMarketImage) {
        await deleteFromCloudinary(
          oldMarketImage
        );
      }

      const result =
        await uploadToCloudinary(
          marketImage,
          "globalscion/conferences/market"
        );

      data.otherData.marketAnalysis.image =
        result.secure_url;
    } else {
      data.otherData.marketAnalysis.image =
        conference.otherData
          ?.marketAnalysis?.image || "";
    }

    if (Array.isArray(data.speakers)) {
      for (
        let index = 0;
        index < data.speakers.length;
        index++
      ) {
        const speakerFile = files.find(
          (file) =>
            file.fieldname ===
            `speakerImage_${index}`
        );

        if (speakerFile) {
          const oldImage =
            conference.speakers?.[index]
              ?.image;

          if (oldImage) {
            await deleteFromCloudinary(
              oldImage
            );
          }

          const result =
            await uploadToCloudinary(
              speakerFile,
              "globalscion/conferences/speakers"
            );

          data.speakers[index].image =
            result.secure_url;
        } else if (
          !data.speakers[index].image
        ) {
          data.speakers[index].image =
            conference.speakers?.[index]
              ?.image || "";
        }
      }
    }

    if (Array.isArray(data.committee)) {
      for (
        let index = 0;
        index < data.committee.length;
        index++
      ) {
        const committeeFile =
          files.find(
            (file) =>
              file.fieldname ===
              `committeeImage_${index}`
          );

        if (committeeFile) {
          const oldImage =
            conference.committee?.[index]
              ?.image;

          if (oldImage) {
            await deleteFromCloudinary(
              oldImage
            );
          }

          const result =
            await uploadToCloudinary(
              committeeFile,
              "globalscion/conferences/committee"
            );

          data.committee[index].image =
            result.secure_url;
        } else if (
          !data.committee[index].image
        ) {
          data.committee[index].image =
            conference.committee?.[index]
              ?.image || "";
        }
      }
    }

    const sponsorFiles = files.filter(
      (file) =>
        file.fieldname.startsWith(
          "sponsorImage_"
        )
    );

    if (sponsorFiles.length > 0) {
      data.sponsors =
        Array.isArray(data.sponsors)
          ? data.sponsors
          : [];

      for (const file of sponsorFiles) {
        const result =
          await uploadToCloudinary(
            file,
            "globalscion/conferences/sponsors"
          );

        const index = Number(
          file.fieldname.replace(
            "sponsorImage_",
            ""
          )
        );

        data.sponsors[index] =
          result.secure_url;
      }

      data.sponsors =
        data.sponsors.filter(Boolean);
    } else {
      data.sponsors =
        conference.sponsors || [];
    }

    data.updatedBy =
      req.user?._id || null;

    const updatedConference =
      await Conference.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Conference updated successfully",
      data: updatedConference,
    });
  } catch (error) {
    console.error(
      "Update conference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update conference",
    });
  }
};

exports.deleteConference = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Conference ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid conference ID",
      });
    }

    const conference =
      await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message:
          "Conference not found",
      });
    }

    if (conference.image) {
      await deleteFromCloudinary(
        conference.image
      );
    }

    if (conference.aboutImage) {
      await deleteFromCloudinary(
        conference.aboutImage
      );
    }

    const marketImage =
      conference.otherData
        ?.marketAnalysis?.image;

    if (marketImage) {
      await deleteFromCloudinary(
        marketImage
      );
    }

    if (
      Array.isArray(
        conference.speakers
      )
    ) {
      for (
        const speaker of conference.speakers
      ) {
        if (speaker.image) {
          await deleteFromCloudinary(
            speaker.image
          );
        }
      }
    }

    if (
      Array.isArray(
        conference.committee
      )
    ) {
      for (
        const member of conference.committee
      ) {
        if (member.image) {
          await deleteFromCloudinary(
            member.image
          );
        }
      }
    }

    if (
      Array.isArray(
        conference.sponsors
      )
    ) {
      for (
        const sponsor of conference.sponsors
      ) {
        if (sponsor) {
          await deleteFromCloudinary(
            sponsor
          );
        }
      }
    }

    await Conference.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Conference deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete conference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete conference",
    });
  }
};

exports.publishConference = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Conference ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid conference ID",
      });
    }

    const conference =
      await Conference.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "Published",
            updatedBy:
              req.user?._id || null,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!conference) {
      return res.status(404).json({
        success: false,
        message:
          "Conference not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Conference published successfully",
      data: conference,
    });
  } catch (error) {
    console.error(
      "Publish conference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to publish conference",
    });
  }
};


exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      employeeType,
      phoneNumber,
      assignedConferences = [],
      status,
      department,
      designation,
      country,
      location,
      timezone,
      about,
      permissions = [],
    } = req.body;


    // ==================================================
    // REQUIRED FIELDS
    // ==================================================

    if (
      !fullName ||
      !email ||
      !password ||
      !employeeType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, password and employee type are required.",
      });
    }


    // ==================================================
    // PASSWORD VALIDATION
    // ==================================================

    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }


    // ==================================================
    // NORMALIZE EMAIL
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();


    // ==================================================
    // EMPLOYEE TYPE
    // ==================================================

    const allowedEmployeeTypes = [
      "event manager",
      "coordinator",
      "marketing",
      "webiner",
    ];

    const normalizedEmployeeType =
      employeeType
        .trim()
        .toLowerCase();


    if (
      !allowedEmployeeTypes.includes(
        normalizedEmployeeType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid employee type.",
      });
    }


    // ==================================================
    // CHECK EXISTING EMPLOYEE
    // ==================================================

    const existingEmployee =
      await Employee.findOne({
        email: normalizedEmail,
      });


    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message:
          "Employee with this email already exists.",
      });
    }


    // ==================================================
    // ASSIGNED CONFERENCES VALIDATION
    // ==================================================

    if (!Array.isArray(assignedConferences)) {
      return res.status(400).json({
        success: false,
        message:
          "assignedConferences must be an array.",
      });
    }


    for (
      const conferenceId of assignedConferences
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          conferenceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid conference ID: ${conferenceId}`,
        });
      }
    }


    if (assignedConferences.length > 0) {

      const conferences =
        await Conference.find({
          _id: {
            $in: assignedConferences,
          },
        }).select("_id");


      if (
        conferences.length !==
        assignedConferences.length
      ) {
        return res.status(404).json({
          success: false,
          message:
            "One or more assigned conferences were not found.",
        });
      }
    }


    // ==================================================
    // STATUS VALIDATION
    // ==================================================

    const employeeStatus = status
      ? status.trim().toLowerCase()
      : "active";


    if (
      !["active", "inactive"].includes(
        employeeStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid employee status.",
      });
    }


    // ==================================================
    // KEEP ORIGINAL PASSWORD FOR EMAIL
    // ==================================================

    // IMPORTANT:
    // This is the plain password entered by admin.
    // It is used ONLY to send the welcome email.
    //
    // Employee schema pre-save middleware will hash
    // the password before storing it in MongoDB.

    const temporaryPassword =
      password.trim();


    // ==================================================
    // CREATE EMPLOYEE
    // ==================================================

    const employee =
      await Employee.create({

        fullName:
          fullName.trim(),

        email:
          normalizedEmail,

        // Main authentication role
        role: "Employee",

        // Employee job type
        employeeType:
          normalizedEmployeeType,

        password:
          temporaryPassword,

        phoneNumber:
          phoneNumber?.trim() || "",

        assignedConferences,

        status:
          employeeStatus,

        department:
          department?.trim() || "",

        designation:
          designation?.trim() || "",

        country:
          country?.trim() || "",

        location:
          location?.trim() || "",

        timezone:
          timezone?.trim() ||
          "Asia/Kolkata",

        about:
          about?.trim() || "",

        permissions:
          Array.isArray(permissions)
            ? permissions
            : [],

        lastLogin:
          null,

        lastLogout:
          null,
      });


    // ==================================================
    // GET CREATED EMPLOYEE
    // ==================================================

    const populatedEmployee =
      await Employee.findById(
        employee._id
      )
        .select("-password")
        .populate(
          "assignedConferences",
          "basicInformation conferenceDates venueInformation"
        );


    // ==================================================
    // SEND LOGIN EMAIL
    // ==================================================

    let emailSent = false;

    try {

      await sendEmployeeCredentials({

        name:
          employee.fullName,

        email:
          employee.email,

        password:
          temporaryPassword,

        employeeType:
          employee.employeeType,
      });

      emailSent = true;

      console.log(
        `✅ Employee credentials email sent to ${employee.email}`
      );

    } catch (emailError) {

      // -----------------------------------------------
      // IMPORTANT
      // Employee is already created.
      // Don't delete the employee just because email
      // failed.
      // -----------------------------------------------

      console.error(
        "❌ Employee created, but credential email failed:"
      );

      console.error(
        emailError
      );
    }


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({

      success: true,

      message: emailSent
        ? "Employee created successfully and login credentials sent to employee email."
        : "Employee created successfully, but login credentials email could not be sent.",

      emailSent,

      data:
        populatedEmployee,
    });

  } catch (error) {

    console.error(
      "Create Employee Error:",
      error
    );


    // ==================================================
    // DUPLICATE KEY
    // ==================================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Employee with this email already exists.",
      });
    }


    // ==================================================
    // SERVER ERROR
    // ==================================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to create employee.",
      error:
        error.message,
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("-password")
      .populate({
        path: "assignedConferences",
        select: "title basicInformation conferenceDates venueInformation",
      })
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

    // --------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    // --------------------------------------------------
    // FIND EMPLOYEE
    // --------------------------------------------------

    const employee = await Employee.findById(id)
      .select("-password")
      .populate(
        "assignedConferences",
        "basicInformation conferenceDates venueInformation"
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

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
      employeeType,
      password,
      phoneNumber,
      assignedConferences,
      status,
      department,
      designation,
      country,
      location,
      timezone,
      about,
      permissions,
    } = req.body;

    // --------------------------------------------------
    // VALIDATE EMPLOYEE ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    // --------------------------------------------------
    // FIND EMPLOYEE
    // --------------------------------------------------

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // --------------------------------------------------
    // EMAIL
    // --------------------------------------------------

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

    // --------------------------------------------------
    // FULL NAME
    // --------------------------------------------------

    if (fullName !== undefined) {
      if (!fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty.",
        });
      }

      employee.fullName = fullName.trim();
    }

    // --------------------------------------------------
    // AUTHENTICATION ROLE
    // --------------------------------------------------
    // Employee role is always Employee
    // --------------------------------------------------

    employee.role = "Employee";

    // --------------------------------------------------
    // EMPLOYEE TYPE
    // --------------------------------------------------

    if (employeeType !== undefined) {
      const allowedEmployeeTypes = [
        "event manager",
        "coordinator",
        "marketing",
        "webiner",
      ];

      const normalizedEmployeeType = employeeType
        .trim()
        .toLowerCase();

      if (
        !allowedEmployeeTypes.includes(
          normalizedEmployeeType
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee type.",
        });
      }

      employee.employeeType = normalizedEmployeeType;
    }

    // --------------------------------------------------
    // PHONE
    // --------------------------------------------------

    if (phoneNumber !== undefined) {
      employee.phoneNumber = phoneNumber.trim();
    }

    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    if (status !== undefined) {
      const normalizedStatus = status
        .trim()
        .toLowerCase();

      if (
        !["active", "inactive"].includes(
          normalizedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee status.",
        });
      }

      employee.status = normalizedStatus;
    }

    // --------------------------------------------------
    // DEPARTMENT
    // --------------------------------------------------

    if (department !== undefined) {
      employee.department = department.trim();
    }

    // --------------------------------------------------
    // DESIGNATION
    // --------------------------------------------------

    if (designation !== undefined) {
      employee.designation = designation.trim();
    }

    // --------------------------------------------------
    // COUNTRY
    // --------------------------------------------------

    if (country !== undefined) {
      employee.country = country.trim();
    }

    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    if (location !== undefined) {
      employee.location = location.trim();
    }

    // --------------------------------------------------
    // TIMEZONE
    // --------------------------------------------------

    if (timezone !== undefined) {
      employee.timezone = timezone.trim();
    }

    // --------------------------------------------------
    // ABOUT
    // --------------------------------------------------

    if (about !== undefined) {
      employee.about = about.trim();
    }

    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------
    // IMPORTANT:
    // Do NOT bcrypt.hash() here.
    // employee.save() will trigger pre("save")
    // and hash the password automatically.
    // --------------------------------------------------

    if (
      password !== undefined &&
      password.trim() !== ""
    ) {
      if (password.trim().length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      employee.password = password.trim();
    }

    // --------------------------------------------------
    // PERMISSIONS
    // --------------------------------------------------

    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          message: "permissions must be an array.",
        });
      }

      employee.permissions = permissions;
    }

    // --------------------------------------------------
    // ASSIGNED CONFERENCES
    // --------------------------------------------------

    if (assignedConferences !== undefined) {
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

        if (
          conferences.length !==
          assignedConferences.length
        ) {
          return res.status(404).json({
            success: false,
            message:
              "One or more assigned conferences were not found.",
          });
        }
      }

      employee.assignedConferences =
        assignedConferences;
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    await employee.save();

    // --------------------------------------------------
    // GET UPDATED EMPLOYEE
    // --------------------------------------------------

    const updatedEmployee =
      await Employee.findById(employee._id)
        .select("-password")
        .populate(
          "assignedConferences",
          "basicInformation conferenceDates venueInformation"
        );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    // --------------------------------------------------
    // FIND EMPLOYEE
    // --------------------------------------------------

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    await Employee.findByIdAndDelete(id);

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

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

exports.createSpeaker = catchAsync(async (req, res, next) => {
  const {
    conferenceId,
    fullName,
    designation,
    speakerType,
    organization,
    country,
    bio,
    email,
    linkedin,
    website,
    status,
  } = req.body;

  if (
    !conferenceId ||
    !fullName ||
    !designation ||
    !organization ||
    !country ||
    !bio
  ) {
    return next(
      new AppError(
        "Conference ID, full name, designation, organization, country and bio are required",
        400
      )
    );
  }

  if (!mongoose.Types.ObjectId.isValid(conferenceId)) {
    return next(
      new AppError("Invalid conference ID", 400)
    );
  }

  const conference = await Conference.findById(conferenceId);

  if (!conference) {
    return next(
      new AppError("Conference not found", 404)
    );
  }

  let imageUrl = "";

  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file,
      "globalscion/speakers"
    );

    imageUrl = uploadResult.secure_url || "";
  }

  const speaker = await Speaker.create({
    conferenceId,
    fullName: fullName.trim(),
    designation: designation.trim(),
    speakerType: speakerType || "Invited Speaker",
    organization: organization.trim(),
    country: country.trim(),
    bio: bio.trim(),
    imageUrl,
    email: email?.trim().toLowerCase() || "",
    linkedin: linkedin?.trim() || "",
    website: website?.trim() || "",
    status: status || "Active",
  });

  return res.status(201).json({
    success: true,
    message: "Speaker created successfully",
    data: speaker,
  });
});

exports.getAllSpeakers = catchAsync(
  async (req, res, next) => {
    const speakers = await Speaker.find()
      .populate(
        "conferenceId",
        "basicInformation conferenceDates"
      )
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Speakers fetched successfully",
      count: speakers.length,
      data: speakers,
    });
  }
);

exports.getSpeakerById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;



    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError("Invalid speaker ID", 400)
      );
    }

    const speaker = await Speaker.findById(
      id
    ).populate(
      "conferenceId",
      "basicInformation conferenceDates venueInformation"
    );

    if (!speaker) {
      return next(
        new AppError("Speaker not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Speaker fetched successfully",
      data: speaker,
    });
  }
);



exports.getSpeakersByConference = catchAsync(async (req, res, next) => {
  const { conferenceId } = req.params;

  // --------------------------------------------------------
  // VALIDATE CONFERENCE ID
  // --------------------------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      conferenceId
    )
  ) {
    return next(
      new AppError(
        "Invalid conference ID",
        400
      )
    );
  }

  // --------------------------------------------------------
  // CHECK CONFERENCE
  // --------------------------------------------------------

  const conference =
    await Conference.findById(
      conferenceId
    );

  if (!conference) {
    return next(
      new AppError(
        "Conference not found",
        404
      )
    );
  }

  // --------------------------------------------------------
  // GET SPEAKERS
  // --------------------------------------------------------

  const speakers = await Speaker.find({
    conferenceId,
  }).sort({
    displayOrder: 1,
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    message:
      "Conference speakers fetched successfully",
    conference: {
      _id: conference._id,
      conferenceName:
        conference.basicInformation
          ?.conferenceName,
      shortName:
        conference.basicInformation?.shortName,
    },
    count: speakers.length,
    data: speakers,
  });
});



exports.updateSpeaker = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE SPEAKER ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError("Invalid speaker ID", 400)
      );
    }

    // --------------------------------------------------------
    // FIND SPEAKER
    // --------------------------------------------------------

    const speaker =
      await Speaker.findById(id);

    if (!speaker) {
      return next(
        new AppError("Speaker not found", 404)
      );
    }

    const {
      conferenceId,
      fullName,
      designation,
      speakerType,
      organization,
      country,
      bio,
      imageUrl,
      email,
      linkedin,
      website,
      status,
    } = req.body;

    // --------------------------------------------------------
    // CONFERENCE UPDATE
    // --------------------------------------------------------

    if (conferenceId !== undefined) {
      if (
        !mongoose.Types.ObjectId.isValid(
          conferenceId
        )
      ) {
        return next(
          new AppError(
            "Invalid conference ID",
            400
          )
        );
      }

      const conference =
        await Conference.findById(
          conferenceId
        );

      if (!conference) {
        return next(
          new AppError(
            "Conference not found",
            404
          )
        );
      }

      speaker.conferenceId =
        conferenceId;
    }

    // --------------------------------------------------------
    // BASIC DETAILS
    // --------------------------------------------------------

    if (fullName !== undefined) {
      speaker.fullName =
        fullName.trim();
    }

    if (designation !== undefined) {
      speaker.designation =
        designation.trim();
    }

    if (speakerType !== undefined) {
      speaker.speakerType =
        speakerType;
    }

    if (organization !== undefined) {
      speaker.organization =
        organization.trim();
    }

    if (country !== undefined) {
      speaker.country =
        country.trim();
    }

    if (bio !== undefined) {
      speaker.bio =
        bio.trim();
    }

    // --------------------------------------------------------
    // CLOUDINARY
    // --------------------------------------------------------

    if (imageUrl !== undefined) {
      speaker.imageUrl =
        imageUrl.trim();
    }

    // --------------------------------------------------------
    // CONTACT
    // --------------------------------------------------------

    if (email !== undefined) {
      speaker.email =
        email.trim().toLowerCase();
    }

    if (linkedin !== undefined) {
      speaker.linkedin =
        linkedin.trim();
    }

    if (website !== undefined) {
      speaker.website =
        website.trim();
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (status !== undefined) {
      speaker.status = status;
    }


    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await speaker.save();

    return res.status(200).json({
      success: true,
      message:
        "Speaker updated successfully",
      data: speaker,
    });
  }
);



exports.deleteSpeaker = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError("Invalid speaker ID", 400)
      );
    }

    // --------------------------------------------------------
    // FIND SPEAKER
    // --------------------------------------------------------

    const speaker =
      await Speaker.findById(id);

    if (!speaker) {
      return next(
        new AppError("Speaker not found", 404)
      );
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await Speaker.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Speaker deleted successfully",
    });
  }
);



exports.deleteAllSpeakers = catchAsync(async (req, res, next) => {
  const result =
    await Speaker.deleteMany({});

  return res.status(200).json({
    success: true,
    message:
      "All speakers deleted successfully",
    deletedCount:
      result.deletedCount,
  });
});


exports.deleteConferenceSpeakers = catchAsync(async (req, res, next) => {
  const { conferenceId } = req.params;

  // --------------------------------------------------------
  // VALIDATE CONFERENCE ID
  // --------------------------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      conferenceId
    )
  ) {
    return next(
      new AppError(
        "Invalid conference ID",
        400
      )
    );
  }

  // --------------------------------------------------------
  // CHECK CONFERENCE
  // --------------------------------------------------------

  const conference =
    await Conference.findById(
      conferenceId
    );

  if (!conference) {
    return next(
      new AppError(
        "Conference not found",
        404
      )
    );
  }

  // --------------------------------------------------------
  // DELETE CONFERENCE SPEAKERS
  // --------------------------------------------------------

  const result =
    await Speaker.deleteMany({
      conferenceId,
    });

  return res.status(200).json({
    success: true,
    message:
      "All speakers of the conference deleted successfully",
    deletedCount:
      result.deletedCount,
  });
});


exports.createConferenceBrochure = catchAsync(
  async (req, res, next) => {
    const {
      title,
      conferenceId,
      status,
    } = req.body;

    if (!title || !conferenceId) {
      return next(
        new AppError(
          "Title and conference ID are required",
          400
        )
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        conferenceId
      )
    ) {
      return next(
        new AppError(
          "Invalid conference ID",
          400
        )
      );
    }

    const conference =
      await Conference.findById(
        conferenceId
      );

    if (!conference) {
      return next(
        new AppError(
          "Conference not found",
          404
        )
      );
    }

    if (!req.file) {
      return next(
        new AppError(
          "Brochure PDF file is required",
          400
        )
      );
    }

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return next(
        new AppError(
          "Only PDF files are allowed",
          400
        )
      );
    }

    const uploadResult =
      await uploadToCloudinary(
        req.file,
        "globalscion/conferences/brochures",
        "raw"
      );

    const brochure =
      await ConferenceBrochure.create({
        title: title.trim(),
        conferenceId,
        file: uploadResult.secure_url,
        status: status || "uploaded",
      });

    const populatedBrochure =
      await ConferenceBrochure.findById(
        brochure._id
      ).populate(
        "conferenceId",
        "basicInformation conferenceDates"
      );

    return res.status(201).json({
      success: true,
      message:
        "Conference brochure uploaded successfully",
      data: populatedBrochure,
    });
  }
);

exports.getAllConferenceBrochures = catchAsync(
  async (req, res, next) => {
    const brochures =
      await ConferenceBrochure.find()
        .populate(
          "conferenceId",
          "title"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    const formattedBrochures =
      brochures.map((brochure) => ({
        _id: brochure._id,

        title: brochure.title,

        conferenceId:
          brochure?.conferenceId?._id || null,

        conferenceTitle:
          brochure?.conferenceId?.title || "",

        file: brochure.file,

        status: brochure.status,

        createdAt: brochure.createdAt,

        updatedAt: brochure.updatedAt,
      }));

    return res.status(200).json({
      success: true,
      count: formattedBrochures.length,
      data: formattedBrochures,
    });
  }
);

exports.getConferenceBrochureById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new AppError(
          "Invalid brochure ID",
          400
        )
      );
    }

    const brochure =
      await ConferenceBrochure.findById(
        id
      ).populate(
        "conferenceId",
        "basicInformation conferenceDates"
      );

    if (!brochure) {
      return next(
        new AppError(
          "Conference brochure not found",
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Conference brochure fetched successfully",
      data: brochure,
    });
  }
);

exports.updateConferenceBrochure = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const {
      title,
      conferenceId,
      status,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new AppError(
          "Invalid brochure ID",
          400
        )
      );
    }

    const brochure =
      await ConferenceBrochure.findById(id);

    if (!brochure) {
      return next(
        new AppError(
          "Conference brochure not found",
          404
        )
      );
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return next(
          new AppError(
            "Brochure title cannot be empty",
            400
          )
        );
      }

      brochure.title =
        title.trim();
    }

    if (conferenceId !== undefined) {
      if (
        !mongoose.Types.ObjectId.isValid(
          conferenceId
        )
      ) {
        return next(
          new AppError(
            "Invalid conference ID",
            400
          )
        );
      }

      const conference =
        await Conference.findById(
          conferenceId
        );

      if (!conference) {
        return next(
          new AppError(
            "Conference not found",
            404
          )
        );
      }

      brochure.conferenceId =
        conferenceId;
    }

    if (status !== undefined) {
      if (
        ![
          "uploaded",
          "pending",
        ].includes(status)
      ) {
        return next(
          new AppError(
            "Status must be uploaded or pending",
            400
          )
        );
      }

      brochure.status = status;
    }

    if (req.file) {
      if (
        req.file.mimetype !==
        "application/pdf"
      ) {
        return next(
          new AppError(
            "Only PDF files are allowed",
            400
          )
        );
      }

      if (brochure.file) {
        await deleteFromCloudinary(
          brochure.file,
          "raw"
        );
      }

      const uploadResult =
        await uploadToCloudinary(
          req.file,
          "globalscion/conferences/brochures",
          "raw"
        );

      brochure.file =
        uploadResult.secure_url;

      brochure.status =
        "uploaded";
    }

    await brochure.save();

    const updatedBrochure =
      await ConferenceBrochure.findById(
        brochure._id
      ).populate(
        "conferenceId",
        "basicInformation conferenceDates"
      );

    return res.status(200).json({
      success: true,
      message:
        "Conference brochure updated successfully",
      data: updatedBrochure,
    });
  }
);

exports.deleteConferenceBrochure = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new AppError(
          "Invalid brochure ID",
          400
        )
      );
    }

    const brochure =
      await ConferenceBrochure.findById(id);

    if (!brochure) {
      return next(
        new AppError(
          "Conference brochure not found",
          404
        )
      );
    }

    if (brochure.file) {
      await deleteFromCloudinary(
        brochure.file,
        "raw"
      );
    }

    await ConferenceBrochure.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Conference brochure deleted successfully",
    });
  }
);




exports.getBrochureDownloadRequests = catchAsync(
  async (req, res, next) => {
    const downloads = await DownloadBrochure.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedDownloads = await Promise.all(
      downloads.map(async (download) => {
        let conference = null;

        if (download.conferenceId) {
          try {
            conference = await Conference.findById(
              download.conferenceId
            )
              .select(
                "_id basicInformation conferenceTitle title name"
              )
              .lean();
          } catch (error) {
            conference = null;
          }
        }

        const conferenceTitle =
          conference?.basicInformation?.conferenceTitle ||
          conference?.basicInformation?.title ||
          conference?.conferenceTitle ||
          conference?.title ||
          conference?.name ||
          download?.conferenceTitle ||
          download?.conferenceName ||
          "Unknown Conference";

        return {
          ...download,

          _id: download._id,

          conferenceId:
            download.conferenceId ||
            conference?._id ||
            null,

          conference: conferenceTitle,

          fullName:
            download.fullName ||
            [
              download.firstName,
              download.lastName,
            ]
              .filter(Boolean)
              .join(" ") ||
            "Unknown User",

          email: download.email || "",

          phone: download.phone || "",

          country: download.country || "",

          requirements:
            download.requirements || "",

          status:
            download.status || "Downloaded",

          downloadedAt:
            download.downloadedAt ||
            download.createdAt ||
            download.updatedAt ||
            null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: formattedDownloads.length,
      data: formattedDownloads,
      message:
        formattedDownloads.length > 0
          ? "Brochure download requests fetched successfully"
          : "No brochure download requests found",
    });
  }
);


exports.getBrochureDownloadRequestById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const download =
      await DownloadBrochure.findById(id).lean();

    if (!download) {
      return res.status(404).json({
        success: false,
        data: null,
        message:
          "Brochure download request not found",
      });
    }

    let conference = null;

    if (download.conferenceId) {
      try {
        conference = await Conference.findById(
          download.conferenceId
        )
          .select(
            "_id basicInformation conferenceTitle title name"
          )
          .lean();
      } catch (error) {
        conference = null;
      }
    }

    const conferenceTitle =
      conference?.basicInformation?.conferenceTitle ||
      conference?.basicInformation?.title ||
      conference?.conferenceTitle ||
      conference?.title ||
      conference?.name ||
      download?.conferenceTitle ||
      download?.conferenceName ||
      "Unknown Conference";

    const formattedDownload = {
      ...download,

      _id: download._id,

      conferenceId:
        download.conferenceId ||
        conference?._id ||
        null,

      conference: conferenceTitle,

      fullName:
        download.fullName ||
        [
          download.firstName,
          download.lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        "Unknown User",

      email: download.email || "",

      phone: download.phone || "",

      country: download.country || "",

      requirements:
        download.requirements || "",

      status:
        download.status || "Downloaded",

      downloadedAt:
        download.downloadedAt ||
        download.createdAt ||
        download.updatedAt ||
        null,
    };

    return res.status(200).json({
      success: true,
      data: formattedDownload,
      message:
        "Brochure download request fetched successfully",
    });
  }
);

exports.getBrochureDownloadStats = catchAsync(
  async (req, res, next) => {
    const totalBrochures =
      await ConferenceBrochure.countDocuments();

    const uploadedBrochures =
      await ConferenceBrochure.countDocuments({
        status: "uploaded",
      });

    const pendingBrochures =
      await ConferenceBrochure.countDocuments({
        status: "pending",
      });

    return res.status(200).json({
      success: true,
      stats: {
        totalBrochures,
        uploadedBrochures,
        pendingBrochures,
        totalDownloads: 0,
      },
    });
  }
);


exports.downloadConferenceBrochure = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError(
          "Invalid conference ID",
          400
        )
      );
    }

    const brochure =
      await ConferenceBrochure.findOne({
        conferenceId: id,
      });

    if (!brochure) {
      return next(
        new AppError(
          "Conference brochure not found",
          404
        )
      );
    }

    if (!brochure.file) {
      return next(
        new AppError(
          "Brochure file not found",
          404
        )
      );
    }

    const response = await fetch(
      brochure.file
    );

    if (!response.ok) {
      return next(
        new AppError(
          "Failed to fetch brochure file",
          500
        )
      );
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    const fileName =
      brochure.originalFilename ||
      `${brochure.title || "brochure"}.pdf`;

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(
        /"/g,
        ""
      )}"`
    );

    res.setHeader(
      "Content-Length",
      buffer.length
    );

    return res.status(200).send(buffer);
  }
);

exports.deleteDownloadBrochure = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Download brochure ID is required",
      });
    }

    const downloadBrochure =
      await DownloadBrochure.findById(id);

    if (!downloadBrochure) {
      return res.status(404).json({
        success: false,
        message: "Download brochure request not found",
      });
    }

    await DownloadBrochure.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Download brochure request deleted successfully",
      data: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Delete Download Brochure Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete download brochure request",
      error: error.message,
    });
  }
};


exports.createReview = async (req, res) => {
  try {
    const {
      fullName,
      category,
      rating,
      description,
      status,
    } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review description is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Reviewer image is required",
      });
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "globalscion/reviews"
    );

    if (!uploadResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Reviewer image upload failed",
      });
    }

    const newReview = await Review.create({
      reviewerImage: uploadResult.secure_url,
      fullName: fullName.trim(),
      category: category.trim(),
      rating: numericRating,
      description: description.trim(),
      status: status || "Published",
      createdBy: req.role?._id || req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};


// ======================================================
// GET ALL REVIEWS
// ======================================================

exports.getAllReviews = async (req, res) => {
  try {
    const {
      search = "",
      rating,
      category,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          fullName: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (rating) {
      const numericRating = Number(rating);

      if (!Number.isNaN(numericRating)) {
        filter.rating = numericRating;
      }
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Review.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};


// ======================================================
// GET REVIEW BY ID
// ======================================================

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundReview = await Review.findById(id);

    if (!foundReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: foundReview,
    });
  } catch (error) {
    console.error("Get review by ID error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch review",
    });
  }
};


// ======================================================
// UPDATE REVIEW
// ======================================================

exports.updateReview = async (req, res) => {
  try {


    const { id } = req.params;

    const foundReview = await Review.findById(id);

    if (!foundReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const {
      fullName,
      category,
      rating,
      description,
      status,
    } = req.body;

    // Full Name
    if (fullName !== undefined) {
      if (!fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty",
        });
      }

      foundReview.fullName = fullName.trim();
    }

    // Category
    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }

      foundReview.category = category.trim();
    }

    // Rating
    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      foundReview.rating = numericRating;
    }

    // Description
    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Review description cannot be empty",
        });
      }

      foundReview.description = description.trim();
    }

    // Status
    if (status !== undefined) {
      if (!["Published", "Draft"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review status",
        });
      }

      foundReview.status = status;
    }

    // New Image
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "globalscion/reviews"
      );

      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Reviewer image upload failed",
        });
      }

      foundReview.reviewerImage = uploadResult.secure_url;
    }

    foundReview.updatedBy =
      req.role?._id || req.user?._id || null;

    await foundReview.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: foundReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};


// ======================================================
// DELETE REVIEW
// ======================================================

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=================================");
    console.log("DELETE REVIEW REQUEST");
    console.log("Review ID:", id);
    console.log("=================================");

    const foundReview = await Review.findById(id);

    console.log("Review found:", !!foundReview);

    if (!foundReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    console.log(
      "MongoDB delete result:",
      !!deletedReview
    );

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review could not be deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};



exports.getActiveBankAccount = async (
  req,
  res
) => {
  try {
    const bankAccount =
      await BankAccount.findOne({
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message:
          "No active bank account configured",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Active bank account fetched successfully",
      data: bankAccount,
    });
  } catch (error) {
    console.error(
      "GET ACTIVE BANK ACCOUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch active bank account",
      error: error.message,
    });
  }
};