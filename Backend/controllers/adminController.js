const Conference = require("../models/conference");
const mongoose = require("mongoose");


const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync")
const Speaker = require("../models/Speaker");
const cloudinary = require("../config/cloudinary");
const Employee = require("../models/Employee");



const uploadToCloudinary = (file, folder = "globalscion/conferences") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};


const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const uploadIndex = imageUrl.indexOf("/upload/");

    if (uploadIndex === -1) return;

    let publicId = imageUrl.substring(uploadIndex + 8);

    publicId = publicId.substring(publicId.indexOf("/") + 1);

    publicId = publicId.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

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

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const employeeData = employee.toObject();

    const conferenceIds = (employeeData.assignedConferences || [])
      .filter((conferenceId) =>
        mongoose.Types.ObjectId.isValid(conferenceId)
      )
      .map((conferenceId) =>
        new mongoose.Types.ObjectId(conferenceId)
      );

    const conferences = await Conference.find({
      _id: {
        $in: conferenceIds,
      },
    }).lean();

    employeeData.conferenceDetails = conferences.map(
      (conference) => ({
        conferenceId: conference._id,
        title: conference.title || "",
        date: conference.date || null,
        startDate: conference.startDate || null,
        endDate: conference.endDate || null,
        mode: conference.mode || "",
        location: conference.location || "",
        status: conference.status || "",
      })
    );

    return res.status(200).json({
      success: true,
      data: employeeData,
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



exports.getSpeakersByConference =
  catchAsync(async (req, res, next) => {
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



exports.deleteAllSpeakers =catchAsync(async (req, res, next) => {
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


exports.deleteConferenceSpeakers =catchAsync(async (req, res, next) => {
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