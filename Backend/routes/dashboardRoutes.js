const express = require("express");
const DashboardController = require("../controllers/DashboardController");

const router = express.Router();

router.get("/employeestats", DashboardController.getEmployeeStatistics);
router.get("/overview", DashboardController.getAdminDashboardOverview);
router.get("/adminstats", DashboardController.getAdminStatistics);

module.exports = router;