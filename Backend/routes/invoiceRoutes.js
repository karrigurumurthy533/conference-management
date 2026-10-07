const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// CREATE INVOICE
router.post(
  "/add",
  authMiddleware("admin"),
  invoiceController.createInvoice
);

// GET ALL INVOICES
router.get(
  "/",
  authMiddleware("admin"),
  invoiceController.getAllInvoices
);

// GET SINGLE INVOICE
router.get(
  "/:id",
  authMiddleware("admin"),
  invoiceController.getInvoiceById
);

// UPDATE INVOICE
router.put(
  "/:id",
  authMiddleware("admin"),
  invoiceController.updateInvoice
);

// UPDATE PAYMENT STATUS
router.patch(
  "/:id/status",
  authMiddleware("admin"),
  invoiceController.updatePaymentStatus
);

router.get(
  "/:id/download",
  invoiceController.downloadInvoicePdf
);

// MARK AS PAID
router.patch(
  "/:id/mark",
  authMiddleware("admin"),
  invoiceController.markInvoiceAsPaid
);

// DELETE INVOICE
router.delete(
  "/:id",
  authMiddleware("admin"),
  invoiceController.deleteInvoice
);

module.exports = router;