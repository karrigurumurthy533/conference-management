const express = require("express");

const invoiceController = require("../controllers/invoiceController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE INVOICE
// =====================================================

router.post(
  "/add",
  authMiddleware("admin"),
  invoiceController.createInvoice
);

// =====================================================
// GET ALL INVOICES
// =====================================================

router.get(
  "/",
  authMiddleware("admin"),
  invoiceController.getAllInvoices
);

// =====================================================
// DOWNLOAD INVOICE PDF
// IMPORTANT: Keep this BEFORE /:id
// =====================================================

router.get(
  "/:id/download",
  authMiddleware("admin"),
  invoiceController.downloadInvoicePdf
);

// =====================================================
// GET SINGLE INVOICE
// =====================================================

router.get(
  "/:id",
  authMiddleware("admin"),
  invoiceController.getInvoiceById
);

// =====================================================
// UPDATE INVOICE
// =====================================================

router.put(
  "/:id",
  authMiddleware("admin"),
  invoiceController.updateInvoice
);

// =====================================================
// DELETE INVOICE
// =====================================================

router.delete(
  "/:id",
  authMiddleware("admin"),
  invoiceController.deleteInvoice
);

module.exports = router;