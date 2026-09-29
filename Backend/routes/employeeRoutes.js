const express = require("express");
const EmployeeController = require("../controllers/EmployeeController");

const router = express.Router();


router.get("/conferences/:conferenceId/attendance", EmployeeController.getConferenceAttendance);


module.exports = router;