const express = require("express");
const conferenceController = require("../controllers/conferenceController");
const conferenceUpload = require("../middlewares/conferenceUpload");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  cacheMiddleware,
} = require("../config/cache");

const router = express.Router();

// IMPORTANT: Add your existing admin-auth middleware before conferenceUpload on write routes.
// Example: router.post("/", protect, restrictTo("admin"), conferenceUpload, controller.createConference);
router.post("/create", authMiddleware("admin"), conferenceUpload, conferenceController.createConference);
router.get("/getAll", cacheMiddleware(60),conferenceController.getAllConferences);
router.get("/:id",cacheMiddleware(60), conferenceController.getConferenceById);
router.put("/:id", conferenceUpload,conferenceController.updateConference);
router.delete("/:id", authMiddleware("admin"), conferenceController.deleteConference);
router.patch("/:id/publish", authMiddleware("admin"), conferenceController.publishConference);
module.exports = router;
