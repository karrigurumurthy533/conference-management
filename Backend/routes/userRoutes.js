const express = require("express");

const UserController = require("../controllers/UserController");

const router = express.Router();

router.post("/registrations", UserController.createRegistration);

router.get("/registrations", UserController.getAllRegistrations);

router.get("/registrations/:id", UserController.getRegistrationById);

router.delete("/registrations/:id", UserController.deleteRegistration);

router.post("/brochures", UserController.createDownloadBrochure);

router.get("/brochures", UserController.getAllDownloadBrochures);

router.get("/brochures/:id", UserController.getDownloadBrochureById);

router.delete("/brochures/:id", UserController.deleteDownloadBrochure);

router.post("/registrations", UserController.createRegistration);

router.get("/registrations", UserController.getAllRegistrations);

router.get("/registrations/:id", UserController.getRegistrationById);

router.delete("/registrations/:id", UserController.deleteRegistration);

module.exports = router;