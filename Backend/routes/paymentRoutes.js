const express = require("express");

const PaymentController = require("../controllers/PaymentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-order", PaymentController.createPaymentOrder);

router.post("/verify", PaymentController.verifyPayment);








// Admin dashboard APIs
router.get("/admin/summary", authMiddleware("admin"),PaymentController.getPaymentSummary);
router.get("/admin",authMiddleware("admin"),PaymentController. getPayments);
router.get("/admin/:id/sync", authMiddleware("admin"),PaymentController. syncPaymentStatus);
router.get("/admin/:id", authMiddleware("admin"), PaymentController.getPaymentById);
router.post("/admin/:id/refund",  PaymentController.refundPayment);


module.exports = router;