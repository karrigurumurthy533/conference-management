const express = require("express");

const UserController = require("../controllers/UserController");
const { upload } = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ======================================================
// BROCHURE ROUTES
// ======================================================

router.post(
  "/brochures",
  UserController.createDownloadBrochure
);

router.get(
  "/brochures",
  UserController.getAllDownloadBrochures
);

router.get(
  "/brochures/:id",
  UserController.getDownloadBrochureById
);

router.delete(
  "/brochures/:id",
  UserController.deleteDownloadBrochure
);

// ======================================================
// REGISTRATION ROUTES
// ======================================================

// Create registration
router.post(
  "/registrations",
  UserController.createRegistration
);

// Get all registrations
router.get(
  "/registrations",
  UserController.getAllRegistrations
);

// Get registrations by conference
// IMPORTANT: This must come BEFORE /registrations/:id
router.get(
  "/registrations/conference/:conferenceId",
  authMiddleware("admin"),
  UserController.getRegistrationsByConferenceId
);

// Get registration by registration ID
router.get(
  "/registrations/:id",
  UserController.getRegistrationById
);

// Delete registration
router.delete(
  "/registrations/:id",
  UserController.deleteRegistration
);

// ======================================================
// ABSTRACT ROUTES
// ======================================================

router.post(
  "/abstract",
  upload.single("file"),
  UserController.createAbstract
);

router.get(
  "/abstracts",
  UserController.getAllAbstracts
);

router.get(
  "/abstracts/:id",
  UserController.getAbstractById
);

router.delete(
  "/abstracts/:id",
  UserController.deleteAbstract
);

module.exports = router;