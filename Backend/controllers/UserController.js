
const Abstract = require("../models/Abstract");
const DownloadBrochure = require("../models/DownloadBrochure");
const Conference = require("../models/conference");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Registration = require("../models/Registration");

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
    return next(new AppError("All required fields are required", 400));
  }

  if (!conference.conferenceId) {
    return next(new AppError("Conference ID is required", 400));
  }

  const existingConference = await Conference.findById(
    conference.conferenceId
  );

  if (!existingConference) {
    return next(new AppError("Conference not found", 404));
  }

  const existingRegistration = await Registration.findOne({
    email: email.toLowerCase(),
    "conference.conferenceId": conference.conferenceId,
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

exports.getAllRegistrations = catchAsync(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [registrations, totalRegistrations] = await Promise.all([
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

  const totalPages = Math.ceil(totalRegistrations / limit);

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
});

exports.getRegistrationById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const registration = await Registration.findById(id).populate(
    "conference.conferenceId",
    "title dates location registration"
  );

  if (!registration) {
    return next(new AppError("Registration not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Registration fetched successfully",
    data: registration,
  });
});

exports.deleteRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const registration = await Registration.findById(id);

  if (!registration) {
    return next(new AppError("Registration not found", 404));
  }

  await Registration.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Registration deleted successfully",
  });
});

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
    registrationId,
    category,
    conferenceId,
    country,
    fullPostalAddress,
  } = req.body;

  if (
    !registrationId ||
    !category ||
    !conferenceId ||
    !country ||
    !fullPostalAddress
  ) {
    return next(new AppError("All required fields are required", 400));
  }

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    return next(new AppError("Registration not found", 404));
  }

  if (registration.status === "Cancelled") {
    return next(
      new AppError(
        "Cancelled registration cannot submit an abstract",
        400
      )
    );
  }

  if (
    registration.conference &&
    registration.conference.conferenceId &&
    registration.conference.conferenceId.toString() !== conferenceId
  ) {
    return next(
      new AppError(
        "Conference does not match the registration",
        400
      )
    );
  }

  const conference = await Conference.findById(conferenceId);

  if (!conference) {
    return next(new AppError("Conference not found", 404));
  }

  const existingAbstract = await Abstract.findOne({
    registrationId,
    conferenceId,
  });

  if (existingAbstract) {
    return next(
      new AppError(
        "Abstract already submitted for this registration",
        409
      )
    );
  }

  let abstractFile = null;

  if (req.file) {
    abstractFile = {
      fileUrl: req.file.path || req.file.location || "",
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype.split("/")[1],
      fileSize: req.file.size,
    };
  }

  if (!abstractFile) {
    return next(new AppError("Abstract file is required", 400));
  }

  const abstract = await Abstract.create({
    registrationId,
    category,
    conferenceId,
    country,
    fullPostalAddress,
    abstractFile,
    status: "Submitted",
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
        "registrationId",
        "title firstName lastName email phone registration"
      )
      .populate(
        "conferenceId",
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

  const abstract = await Abstract.findById(id)
    .populate(
      "registrationId",
      "title firstName lastName email phone registration"
    )
    .populate(
      "conferenceId",
      "title dates location"
    );

  if (!abstract) {
    return next(new AppError("Abstract not found", 404));
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