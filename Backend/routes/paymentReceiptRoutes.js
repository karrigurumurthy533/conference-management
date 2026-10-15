
const express = require("express");
const router = express.Router();

const PaymentReceiptController = require("../controllers/PaymentReceiptController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create receipt
router.post("/create",authMiddleware("admin"),PaymentReceiptController.createPaymentReceipt);
router.post("/createfix", authMiddleware("admin"), PaymentReceiptController.createPaymentReceipt);

// Get all receipts
router.get("/getAll", authMiddleware("admin"),PaymentReceiptController.getAllPaymentReceipts);

// Get receipt by ID
router.get("/:id",authMiddleware("admin"),PaymentReceiptController.getPaymentReceiptById);

// Update receipt
router.put("/:id",authMiddleware("admin"),PaymentReceiptController.updatePaymentReceipt);

// Delete receipt
router.delete("/:id",authMiddleware("admin"),PaymentReceiptController.deletePaymentReceipt);

router.get("/:id/download",authMiddleware("admin"),PaymentReceiptController.downloadPaymentReceipt);


module.exports = router;

