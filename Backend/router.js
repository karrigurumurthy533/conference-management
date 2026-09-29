const express = require("express");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes")
const paymentRoutes = require("./routes/paymentRoutes");
const employeeRoutes= require("./routes/employeeRoutes");
const notificationRoutes= require("./routes/notificationRoutes");
const dashboardRoutes= require("./routes/dashboardRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/payments", paymentRoutes);
router.use("/employee", employeeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notification", notificationRoutes);

module.exports = router;