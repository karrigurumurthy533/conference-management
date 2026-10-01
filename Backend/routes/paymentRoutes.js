const express = require("express");

const PaymentController = require("../controllers/PaymentController");

const router = express.Router();

router.post("/create-order", PaymentController.createPaymentOrder);

router.post("/verify", PaymentController.verifyPayment);

module.exports = router;