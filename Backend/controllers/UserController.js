
const Abstract = require("../models/Abstract");
const DownloadBrochure = require("../models/DownloadBrochure");
const Conference = require("../models/conference");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Registration = require("../models/Registration");
const mongoose = require("mongoose");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload")
const Subscriber = require("../models/Subscriber");



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
  const conferenceLocation =
    typeof conference.location === "string"
      ? conference.location.trim()
      : "";

  if (!conferenceLocation) {
    return next(
      new AppError(
        "Conference location is missing",
        400
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
      location: conferenceLocation,
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

exports.downloadAbstract = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid abstract ID", 400));
  }

  // Find abstract
  const abstract = await Abstract.findById(id)
    .populate(
      "abstractDetails.conferenceId",
      "title dates location"
    );

  if (!abstract) {
    return next(new AppError("Abstract not found", 404));
  }

  // Check abstract file
  if (!abstract.abstractFile) {
    return next(
      new AppError("Abstract file not found", 404)
    );
  }

  // Get Cloudinary URL
  const fileUrl =
    abstract.abstractFile.fileUrl ||
    abstract.abstractFile.url ||
    abstract.abstractFile.secure_url;

  if (!fileUrl) {
    return next(
      new AppError("Abstract file URL not found", 404)
    );
  }

  // Full name
  const fullName = `${abstract.presenter?.firstName || ""} ${abstract.presenter?.lastName || ""
    }`.trim();

  // Response
  return res.status(200).json({
    success: true,
    message: "Abstract download URL generated successfully",

    data: {
      abstractId: abstract._id,

      presenter: {
        title: abstract.presenter?.title || "",
        firstName: abstract.presenter?.firstName || "",
        lastName: abstract.presenter?.lastName || "",
        fullName,
        email: abstract.presenter?.email || "",
        phone: abstract.presenter?.phone || "",
      },

      abstractDetails: {
        category:
          abstract.abstractDetails?.category || "",

        conference: abstract.abstractDetails?.conferenceId
          ? {
            id: abstract.abstractDetails.conferenceId._id,
            title:
              abstract.abstractDetails.conferenceId.title ||
              "",
            dates:
              abstract.abstractDetails.conferenceId.dates ||
              null,
            location:
              abstract.abstractDetails.conferenceId.location ||
              null,
          }
          : null,
      },

      location: {
        country: abstract.location?.country || "",
        fullPostalAddress:
          abstract.location?.fullPostalAddress || "",
      },

      file: {
        fileName:
          abstract.abstractFile.originalFileName || "abstract",
        fileType:
          abstract.abstractFile.fileType || "",
        fileSize:
          abstract.abstractFile.fileSize || 0,
        fileUrl,
      },

      status: abstract.status,
      reviewStatus: abstract.reviewStatus,
      submittedAt: abstract.submittedAt,
    },
  });
});



exports.subscribe = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      conferenceId,
    } = req.body;

    // Validation
    if (!name || !email || !phoneNumber || !conferenceId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number and conference are required",
      });
    }

    // Check duplicate subscription
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase().trim(),
      conferenceId,
    });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "You are already subscribed to this conference",
        data: existingSubscriber,
      });
    }

    const subscriber = await Subscriber.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      conferenceId,
      status: "Active",
    });

    const populatedSubscriber = await Subscriber.findById(
      subscriber._id
    ).populate(
      "conferenceId",
      "basicInformation conferenceDates"
    );

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: populatedSubscriber,
    });
  } catch (error) {
    console.error("Subscribe Error:", error);

    // Duplicate key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already subscribed to this conference",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to subscribe",
      error: error.message,
    });
  }
};


exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .populate("conferenceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Subscribers fetched successfully",
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error("Get All Subscribers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers",
      error: error.message,
    });
  }
};

exports.getSubscriberById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id).populate(
      "conferenceId",
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber fetched successfully",
      data: subscriber,
    });
  } catch (error) {
    console.error("Get Subscriber By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscriber",
      error: error.message,
    });
  }
};


exports.getConferenceWiseRegisteredUsers = catchAsync(
  async (req, res, next) => {
    /* =========================================================
       GET ALL CONFERENCES
    ========================================================= */

    const conferences = await Conference.find()
      .sort({ createdAt: -1 })
      .lean();

    /* =========================================================
       GET ALL REGISTRATIONS
    ========================================================= */

    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .lean();

    /* =========================================================
       GROUP REGISTRATIONS BY CONFERENCE
       
       Registration structure:

       conference: {
         conferenceId: ObjectId,
         title: String,
         date: String,
         location: String
       }
    ========================================================= */

    const data = conferences.map((conference) => {
      const conferenceId = String(
        conference._id
      );

      /* =======================================================
         GET USERS REGISTERED FOR THIS CONFERENCE
      ======================================================= */

      const conferenceRegistrations =
        registrations.filter(
          (registration) =>
            String(
              registration?.conference
                ?.conferenceId
            ) === conferenceId
        );

      /* =======================================================
         RETURN CONFERENCE DATA
      ======================================================= */

      return {
        /* =====================================================
           CONFERENCE INFORMATION
        ===================================================== */

        conferenceId:
          conference._id,

        conferenceName:
          conference.title ||
          conference.name ||
          "Untitled Conference",

        conferenceStatus:
          conference.status || null,

        /* =====================================================
           CONFERENCE DATES
           
           From Conference collection
        ===================================================== */

        conferenceDates: {
          startDate:
            conference.startDate || null,

          endDate:
            conference.endDate || null,
        },

        /* =====================================================
           CONFERENCE LOCATION
           
           From Conference collection
        ===================================================== */

        conferenceLocation:
          conference.location ||
          conference.venue?.city ||
          null,

        /* =====================================================
           CONFERENCE MODE
        ===================================================== */

        conferenceMode:
          conference.mode ||
          conference.time ||
          null,

        /* =====================================================
           PARTICIPANTS
        ===================================================== */

        participants:
          conference.participants || null,

        /* =====================================================
           TOTAL REGISTERED USERS
        ===================================================== */

        totalRegisteredUsers:
          conferenceRegistrations.length,

        /* =====================================================
           COMPLETE REGISTERED USER DETAILS
        ===================================================== */

        users:
          conferenceRegistrations,
      };
    });

    /* =========================================================
       TOTAL REGISTERED USERS ACROSS ALL CONFERENCES
    ========================================================= */

    const totalRegisteredUsersAllConferences =
      registrations.length;

    /* =========================================================
       TOTAL CONFERENCES
    ========================================================= */

    const totalConferences =
      conferences.length;

    /* =========================================================
       RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,

      data,

      totalRegisteredUsersAllConferences,

      totalConferences,
    });
  }
);