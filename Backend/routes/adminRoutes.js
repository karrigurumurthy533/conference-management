const express = require("express");

const adminController = require("../controllers/adminController");
const adminAttendanceController = require("../controllers/adminAttendanceController");

const authMiddleware = require("../middlewares/authMiddleware");
const {
    conferenceUpload,
    upload,
} = require("../middlewares/uploadMiddleware");


const { validationResult } = require("express-validator");

const router = express.Router();


router.post("/conferences", authMiddleware("admin"), conferenceUpload, adminController.createConference);

router.get("/conferences", adminController.getAllConferences);
router.get("/conferences/:id", adminController.getConferenceById);
router.put("/conferences/:id", conferenceUpload, adminController.updateConference);
router.delete("/conferences/:id", authMiddleware("admin"), adminController.deleteConference);
router.patch("/conferences/:id/publish", authMiddleware("admin"), adminController.publishConference);

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
    "/speakers/:id",
    authMiddleware("admin"),
    adminController.deleteSpeaker
);

router.post(
    "/brochures",
    authMiddleware("admin"),
    upload.single("brochure"),
    adminController.createConferenceBrochure
);

router.get(
    "/brochures",
    authMiddleware("admin"),
    adminController.getAllConferenceBrochures
);

router.get(
    "/brochures/download-requests",
    authMiddleware("admin"),
    adminController.getBrochureDownloadRequests
);

router.get(
    "/brochures/download-requests/:id",
    authMiddleware("admin"),
    adminController.getBrochureDownloadRequestById
);

router.get(
    "/brochures/download-stats",
    authMiddleware("admin"),
    adminController.getBrochureDownloadStats
);

router.delete(
    "/brochures/download-requests/:id",
    authMiddleware("admin"),
    adminController.deleteDownloadBrochure
);

router.get(
    "/brochures/:id/download",
    adminController.downloadConferenceBrochure
);

router.get(
    "/brochures/:id",
    authMiddleware("admin"),
    adminController.getConferenceBrochureById
);

router.put(
    "/brochures/:id",
    authMiddleware("admin"),
    upload.single("brochure"),
    adminController.updateConferenceBrochure
);

router.delete(
    "/brochures/:id",
    authMiddleware("admin"),
    adminController.deleteConferenceBrochure
);


router.post(
    "/reviews",
    authMiddleware("admin"),
    upload.single("reviewerImage"),
    adminController.createReview
);

// Get All Reviews
router.get(
    "/reviews",
    adminController.getAllReviews
);

// Get Review By ID
router.get(
    "/reviews/:id",
    authMiddleware("admin"),
    adminController.getReviewById
);

// Update Review By ID
router.put(
    "/reviews/:id",
    authMiddleware("admin"),
    upload.single("reviewerImage"),
    adminController.updateReview
);

// Delete Review By ID
router.delete(
    "/reviews/:id",
    authMiddleware("admin"),
    adminController.deleteReview
);


router.get(
  "/bank-accounts/active",
  authMiddleware("admin"),
  adminController.getActiveBankAccount
);


router.get(
  "/Attendence-dashboard",
  authMiddleware("admin"),
  adminAttendanceController.getAttendanceDashboard
);

/*
|--------------------------------------------------------------------------
| All Attendance
|--------------------------------------------------------------------------
*/

router.get(
  "/getAllAtendence",
  authMiddleware("admin"),
  adminAttendanceController.getAllAttendance
);

/*
|--------------------------------------------------------------------------
| Employee Attendance
|--------------------------------------------------------------------------
*/

router.get(
  "/attendance/:id",
  authMiddleware("admin"),
  adminAttendanceController.getEmployeeAttendance
);


module.exports = router;