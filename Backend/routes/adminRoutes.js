const express = require("express");

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const {
    conferenceUpload,
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
    "/employee",
    authMiddleware("admin"),
    adminController.createEmployee
);

router.get(
    "/employees",
    authMiddleware("admin"),
    adminController.getAllEmployees
);

router.get(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.getEmployeeById
);

router.put(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.updateEmployee
);

router.delete(
    "/employee/:employeeId",
    authMiddleware("admin"),
    adminController.deleteEmployee
);


// Add Speaker
router.post(
    "/",
    authMiddleware("admin"),
    adminController.createSpeaker
);

// Get All Speakers
router.get(
    "/",
    authMiddleware("admin"),
    adminController.getAllSpeakers
);

// Delete All Speakers
router.delete(
    "/",
    authMiddleware("admin"),
    adminController.deleteAllSpeakers
);

// Get Speakers By Conference
router.get(
    "/conference/:conferenceId",
    authMiddleware("admin"),
    adminController.getSpeakersByConference
);

// Delete All Speakers Of Conference
router.delete(
    "/conference/:conferenceId",
    authMiddleware("admin"),
    adminController.deleteConferenceSpeakers
);

// Get Speaker By ID
router.get(
    "/:speakerId",
    authMiddleware("admin"),
    adminController.getSpeakerById
);

// Update Speaker
router.patch(
    "/:speakerId",
    authMiddleware("admin"),
    adminController.updateSpeaker
);

// Delete Speaker
router.delete(
    "/:speakerId",
    authMiddleware("admin"),
    adminController.deleteSpeaker
);

module.exports = router;