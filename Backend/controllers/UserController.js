
const Abstract = require("../models/Abstract");
const DownloadBrochure = require("../models/DownloadBrochure");
const Conference = require("../models/conference");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Registration = require("../models/Registration");
const mongoose = require("mongoose");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload")



exports.createRegistration = catchAsync(async (req, res, next) => {
  const {
    title,
    firstName,
    lastName,
    email,
    phone,
    conference,
    location,
    registration,
  } = req.body;

  if (
    !title ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !conference ||
    !location ||
    !registration
  ) {
    return next(
      new AppError("All required fields are required", 400)
    );
  }

  if (!conference.conferenceId) {
    return next(
      new AppError("Conference ID is required", 400)
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      conference.conferenceId
    )
  ) {
    return next(
      new AppError("Invalid conference ID", 400)
    );
  }

  const existingConference = await Conference.findById(
    conference.conferenceId
  );

  if (!existingConference) {
    return next(
      new AppError("Conference not found", 404)
    );
  }

  const existingRegistration =
    await Registration.findOne({
      email: email.toLowerCase(),
      "conference.conferenceId":
        conference.conferenceId,
    });

  if (existingRegistration) {
    return next(
      new AppError(
        "You have already registered for this conference",
        409
      )
    );
  }

  const newRegistration = await Registration.create({
    title,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,

    conference: {
      conferenceId: conference.conferenceId,
      title: conference.title,
      date: conference.date,
      location: conference.location,
    },

    location: {
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: location.country,
      address: location.address,
    },

    registration: {
      category: registration.category,
      option: registration.option,
      price: registration.price,
      currency: registration.currency,
    },

    status: "Pending",
    paymentStatus: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Registration created successfully",
    data: newRegistration,
  });
});


exports.getAllRegistrations = catchAsync(
  async (req, res, next) => {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.max(
      parseInt(req.query.limit) || 10,
      1
    );

    const skip = (page - 1) * limit;

    const [
      registrations,
      totalRegistrations,
    ] = await Promise.all([
      Registration.find()
        .populate(
          "conference.conferenceId",
          "title dates location registration"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Registration.countDocuments(),
    ]);

    const totalPages = Math.ceil(
      totalRegistrations / limit
    );

    res.status(200).json({
      success: true,
      message: "Registrations fetched successfully",
      data: registrations,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistrations,
        limit,
      },
    });
  }
);

exports.getRegistrationsByConferenceId = catchAsync(
  async (req, res, next) => {
    const { conferenceId } = req.params;

    // Validate conference ID
    if (
      !mongoose.Types.ObjectId.isValid(conferenceId)
    ) {
      return next(
        new AppError("Invalid conference ID", 400)
      );
    }

    // Check conference exists
    const conference = await Conference.findById(
      conferenceId
    );

    if (!conference) {
      return next(
        new AppError("Conference not found", 404)
      );
    }

    // Fetch registrations
    const registrations =
      await Registration.find({
        "conference.conferenceId": conferenceId,
      })
        .populate(
          "conference.conferenceId",
          "title dates location registration"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message:
        "Conference registrations fetched successfully",
      count: registrations.length,
      data: registrations,
    });
  }
);



exports.getRegistrationById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError("Invalid registration ID", 400)
      );
    }

    const registration =
      await Registration.findById(id).populate(
        "conference.conferenceId",
        "title dates location registration"
      );

    if (!registration) {
      return next(
        new AppError("Registration not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Registration fetched successfully",
      data: registration,
    });
  }
);

// ======================================================
// DELETE REGISTRATION
// ======================================================

exports.deleteRegistration = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new AppError("Invalid registration ID", 400)
      );
    }

    const registration =
      await Registration.findById(id);

    if (!registration) {
      return next(
        new AppError("Registration not found", 404)
      );
    }

    await Registration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  }
);

exports.createDownloadBrochure = catchAsync(async (req, res, next) => {
  const {
    conferenceId,
    fullName,
    email,
    phone,
    country,
    requirements,
  } = req.body;

  if (
    !conferenceId ||
    !fullName ||
    !email ||
    !phone ||
    !country ||
    !requirements
  ) {
    return next(
      new AppError("All required fields are required", 400)
    );
  }

  const conference = await Conference.findById(conferenceId);

  if (!conference) {
    return next(
      new AppError("Conference not found", 404)
    );
  }

  const brochure = await DownloadBrochure.create({
    conferenceId,
    fullName,
    email: email.toLowerCase(),
    phone,
    country,
    requirements,
  });

  res.status(201).json({
    success: true,
    message: "Brochure request submitted successfully",
    data: brochure,
  });
});
exports.getAllDownloadBrochures = catchAsync(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [brochures, totalBrochures] = await Promise.all([
    DownloadBrochure.find()
      .populate("conferenceId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    DownloadBrochure.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Brochure requests fetched successfully",
    data: brochures,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalBrochures / limit),
      totalBrochures,
      limit,
    },
  });
});

exports.getDownloadBrochureById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const brochure = await DownloadBrochure.findById(id).populate(
    "conferenceId",
    "title"
  );

  if (!brochure) {
    return next(new AppError("Brochure request not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Brochure request fetched successfully",
    data: brochure,
  });
});

exports.deleteDownloadBrochure = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const brochure = await DownloadBrochure.findById(id);

  if (!brochure) {
    return next(new AppError("Brochure request not found", 404));
  }

  await DownloadBrochure.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Brochure request deleted successfully",
  });
});


exports.createAbstract = catchAsync(async (req, res, next) => {


  const {
    title,
    firstName,
    lastName,
    email,
    phone,
    category,
    conferenceId,
    country,
    fullPostalAddress,
  } = req.body;

  if (
    !title ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !category ||
    !conferenceId ||
    !country ||
    !fullPostalAddress
  ) {
    return next(
      new AppError("All required fields are required", 400)
    );
  }

  if (!mongoose.Types.ObjectId.isValid(conferenceId)) {
    return next(
      new AppError("Invalid conference ID", 400)
    );
  }

  const conferenceData = await Conference.findById(conferenceId);

  if (!conferenceData) {
    return next(
      new AppError("Conference not found", 404)
    );
  }

  const existingAbstract = await Abstract.findOne({
    "presenter.email": email.toLowerCase(),
    "abstractDetails.conferenceId": conferenceData._id,
  });

  if (existingAbstract) {
    return next(
      new AppError(
        "Abstract already submitted for this conference",
        409
      )
    );
  }

  if (!req.file) {
    return next(
      new AppError("Abstract file is required", 400)
    );
  }

  const fileTypeMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };

  const fileType = fileTypeMap[req.file.mimetype];

  if (!fileType) {
    return next(
      new AppError(
        "Only JPG, JPEG, PNG, WEBP, PDF, DOC and DOCX files are allowed",
        400
      )
    );
  }

  let cloudinaryResult;

  try {
    cloudinaryResult = await uploadToCloudinary(
      req.file,
      "globalscion/abstracts"
    );
  } catch (error) {
    console.error("========== CLOUDINARY ERROR ==========");
    console.error("Message:", error.message);
    console.error("Error:", error);
    console.error("======================================");

    return next(
      new AppError(
        error.message || "Failed to upload abstract file",
        500
      )
    );
  }

  const abstractFile = {
    fileUrl: cloudinaryResult.secure_url,
    originalFileName: req.file.originalname,
    fileType,
    fileSize: req.file.size,
  };

  const abstract = await Abstract.create({
    presenter: {
      title,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
    },

    abstractDetails: {
      category,
      conferenceId: conferenceData._id,
    },

    location: {
      country,
      fullPostalAddress,
    },

    abstractFile,

    status: "Submitted",
    reviewStatus: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Abstract submitted successfully",
    data: abstract,
  });
});

exports.getAllAbstracts = catchAsync(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [abstracts, totalAbstracts] = await Promise.all([
    Abstract.find()
      .populate(
        "abstractDetails.conferenceId",
        "title dates location"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Abstract.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Abstracts fetched successfully",
    data: abstracts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalAbstracts / limit),
      totalAbstracts,
      limit,
    },
  });
});

exports.getAbstractById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      new AppError("Invalid abstract ID", 400)
    );
  }

  const abstract = await Abstract.findById(id)
    .populate(
      "abstractDetails.conferenceId",
      "title dates location"
    );

  if (!abstract) {
    return next(
      new AppError("Abstract not found", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Abstract fetched successfully",
    data: abstract,
  });
});

exports.deleteAbstract = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const abstract = await Abstract.findById(id);

  if (!abstract) {
    return next(new AppError("Abstract not found", 404));
  }

  await Abstract.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Abstract deleted successfully",
  });
});