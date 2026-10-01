const express = require("express");

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const {
    conferenceUpload,
    upload,
} = require("../middlewares/uploadMiddleware");


const {
    createConferenceValidation,
} = require("../validations/adminValidations");

const { validationResult } = require("express-validator");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};

router.post("/conferences",authMiddleware("admin"),conferenceUpload, adminController.createConference);
router.get("/conferences", adminController.getAllConferences);
router.get("/conferences/:id", adminController.getConferenceById);
router.put("/conferences/:id", conferenceUpload, adminController.updateConference);
router.delete("/conferences/:id", authMiddleware("admin"),adminController.deleteConference);
router.patch("/conferences/:id/publish",authMiddleware("admin"), adminController.publishConference);

router.post(
    "/employees",
    authMiddleware("admin"),
    adminController.createEmployee
);

router.get(
    "/employees",
    authMiddleware("admin"),
    adminController.getAllEmployees
);

router.get(
    "/employee/:id",
    authMiddleware("admin"),
    adminController.getEmployeeById
);

router.put(
    "/employee/:id",
    authMiddleware("admin"),
    adminController.updateEmployee
);

router.delete(
    "/employee/:id",
    authMiddleware("admin"),
    adminController.deleteEmployee
);


// Add Speaker
router.post(
    "/speakers",
    
    authMiddleware("admin"),
    upload.single("image"),
    adminController.createSpeaker
);

// Get All Speakers
router.get(
    "/speakers",
    authMiddleware("admin"),
    adminController.getAllSpeakers
);

// Delete All Speakers
router.delete(
    "/speakers",
    authMiddleware("admin"),
    adminController.deleteAllSpeakers
);

// Get Speakers By Conference
router.get(
    "/speakers/conference/:id",
    authMiddleware("admin"),
    adminController.getSpeakersByConference
);

// Delete All Speakers Of Conference
router.delete(
    "/speakers/conference/:id",
    authMiddleware("admin"),
    adminController.deleteConferenceSpeakers
);

// Get Speaker By ID
router.get(
    "/speakers/:id",
    authMiddleware("admin"),
    adminController.getSpeakerById
);

// Update Speaker
router.patch(
    "/speaker/:id",
    authMiddleware("admin"),
    adminController.updateSpeaker
);

// Delete Speaker
router.delete(
    "/speaker/:id",
    authMiddleware("admin"),
    adminController.deleteSpeaker
);

module.exports = router;