


const mongoose = require("mongoose");

const Invoice = require("../models/Invoice");
const Conference = require("../models/conference");
const invoiceTemplate = require("../utils/invoiceTemplate");
const chromium = require("@sparticuz/chromium");



const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// CREATE INVOICE
// =====================================================

exports.createInvoice = async (req, res) => {
  try {
    const {
      invoiceDate,
      customer,
      conferenceId,
      amount,
      taxPercentage,
      currency,
      paymentStatus,
      bank,
    } = req.body;

    // ---------------------------------------------------
    // VALIDATE CONFERENCE ID
    // ---------------------------------------------------

    if (!conferenceId) {
      return res.status(400).json({
        success: false,
        message: "Conference ID is required",
      });
    }

    if (!isValidObjectId(conferenceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conference ID",
      });
    }

    // ---------------------------------------------------
    // CHECK CONFERENCE EXISTS
    // ---------------------------------------------------

    const conference = await Conference.findById(
      conferenceId
    );

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // ---------------------------------------------------
    // VALIDATE CUSTOMER
    // ---------------------------------------------------

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer details are required",
      });
    }

    if (!customer.fullName) {
      return res.status(400).json({
        success: false,
        message: "Customer full name is required",
      });
    }

    if (!customer.email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    // ---------------------------------------------------
    // VALIDATE AMOUNT
    // ---------------------------------------------------

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const finalAmount = Number(amount);

    if (
      Number.isNaN(finalAmount) ||
      finalAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be a valid positive number",
      });
    }

    // ---------------------------------------------------
    // TAX PERCENTAGE
    // DEFAULT = 20%
    // ---------------------------------------------------

    const finalTaxPercentage =
      taxPercentage !== undefined &&
      taxPercentage !== null &&
      taxPercentage !== ""
        ? Number(taxPercentage)
        : 20;

    if (
      Number.isNaN(finalTaxPercentage) ||
      finalTaxPercentage < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax percentage",
      });
    }

    // ---------------------------------------------------
    // CALCULATE TAX
    // ---------------------------------------------------

    const calculatedTax = Number(
      (
        (finalAmount * finalTaxPercentage) /
        100
      ).toFixed(2)
    );

    // ---------------------------------------------------
    // CALCULATE TOTAL
    // ---------------------------------------------------

    const calculatedTotal = Number(
      (
        finalAmount +
        calculatedTax
      ).toFixed(2)
    );

    // ---------------------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------------------

    const finalPaymentStatus =
      paymentStatus || "Pending";

    const allowedPaymentStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Cancelled",
      "Refunded",
    ];

    if (
      !allowedPaymentStatuses.includes(
        finalPaymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // ---------------------------------------------------
    // INVOICE STATUS
    // ---------------------------------------------------

    let invoiceStatus = "Draft";

    if (finalPaymentStatus === "Paid") {
      invoiceStatus = "Paid";
    } else if (
      finalPaymentStatus === "Cancelled"
    ) {
      invoiceStatus = "Cancelled";
    } else if (
      finalPaymentStatus === "Pending"
    ) {
      invoiceStatus = "Pending";
    }

    // ---------------------------------------------------
    // CREATE INVOICE
    // ---------------------------------------------------

    const invoice = await Invoice.create({
      invoiceDate:
        invoiceDate || new Date(),

      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone || "",
        country: customer.country || "",
        address: customer.address || "",
      },

      conferenceId,

      amount: finalAmount,

      taxPercentage: finalTaxPercentage,

      tax: calculatedTax,

      totalAmount: calculatedTotal,

      currency: currency || "USD",

      paymentStatus: finalPaymentStatus,

      bank: {
        bankName: bank?.bankName || "",
        accountName: bank?.accountName || "",
        accountNumber:
          bank?.accountNumber || "",
        ifscCode: bank?.ifscCode || "",
        swiftCode: bank?.swiftCode || "",
      },

      status: invoiceStatus,

      paidAt:
        finalPaymentStatus === "Paid"
          ? new Date()
          : undefined,
    });

    // ---------------------------------------------------
    // POPULATE RESPONSE
    // ---------------------------------------------------

    const populatedInvoice =
      await Invoice.findById(invoice._id)
        .populate("conferenceId");

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Invoice created successfully",
      data: populatedInvoice,
    });
  } catch (error) {
    console.error(
      "Create Invoice Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create invoice",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL INVOICES
// =====================================================

exports.getAllInvoices = async (
  req,
  res
) => {
  try {
    const {
      search,
      status,
      paymentStatus,
      conferenceId,
      page = 1,
      limit = 10,
    } = req.query;

    // ---------------------------------------------------
    // PAGINATION
    // ---------------------------------------------------

    const currentPage = Math.max(
      parseInt(page) || 1,
      1
    );

    const perPage = Math.max(
      parseInt(limit) || 10,
      1
    );

    const skip =
      (currentPage - 1) *
      perPage;

    // ---------------------------------------------------
    // FILTER
    // ---------------------------------------------------

    const filter = {};

    // ---------------------------------------------------
    // SEARCH
    // ---------------------------------------------------

    if (search && search.trim()) {
      const searchValue =
        search.trim();

      filter.$or = [
        {
          invoiceNumber: {
            $regex: searchValue,
            $options: "i",
          },
        },

        {
          "customer.fullName": {
            $regex: searchValue,
            $options: "i",
          },
        },

        {
          "customer.email": {
            $regex: searchValue,
            $options: "i",
          },
        },

        {
          "customer.phone": {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    // ---------------------------------------------------
    // STATUS
    // ---------------------------------------------------

    if (status) {
      filter.status = status;
    }

    // ---------------------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------------------

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    // ---------------------------------------------------
    // CONFERENCE
    // ---------------------------------------------------

    if (conferenceId) {
      if (
        !isValidObjectId(
          conferenceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conference ID",
        });
      }

      filter.conferenceId =
        conferenceId;
    }

    // ---------------------------------------------------
    // FETCH INVOICES
    // ---------------------------------------------------

    const [
      invoices,
      totalInvoices,
    ] = await Promise.all([
      Invoice.find(filter)
        .populate("conferenceId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Invoice.countDocuments(filter),
    ]);

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Invoices fetched successfully",

      data: invoices,

      pagination: {
        currentPage,
        limit: perPage,
        totalInvoices,

        totalPages: Math.ceil(
          totalInvoices /
            perPage
        ),

        hasNextPage:
          currentPage <
          Math.ceil(
            totalInvoices /
              perPage
          ),

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get All Invoices Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE INVOICE
// =====================================================

exports.getInvoiceById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ---------------------------------------------------
    // VALIDATE ID
    // ---------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    // ---------------------------------------------------
    // FIND INVOICE
    // ---------------------------------------------------

    const invoice =
      await Invoice.findById(id)
        .populate("conferenceId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(
      "Get Invoice Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch invoice",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE INVOICE
// =====================================================

exports.updateInvoice = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ---------------------------------------------------
    // VALIDATE INVOICE ID
    // ---------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    // ---------------------------------------------------
    // FIND EXISTING INVOICE
    // ---------------------------------------------------

    const existingInvoice =
      await Invoice.findById(id);

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    // ---------------------------------------------------
    // ALLOWED FIELDS
    // ---------------------------------------------------

    const allowedFields = [
      "invoiceDate",
      "customer",
      "conferenceId",
      "amount",
      "taxPercentage",
      "currency",
      "paymentStatus",
      "bank",
      "status",
      "paidAt",
    ];

    // ---------------------------------------------------
    // UPDATE FIELDS
    // ---------------------------------------------------

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          existingInvoice[field] =
            req.body[field];
        }
      }
    );

    // ---------------------------------------------------
    // VALIDATE CONFERENCE
    // ---------------------------------------------------

    if (
      req.body.conferenceId
    ) {
      if (
        !isValidObjectId(
          req.body.conferenceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conference ID",
        });
      }

      const conference =
        await Conference.findById(
          req.body.conferenceId
        );

      if (!conference) {
        return res.status(404).json({
          success: false,
          message:
            "Conference not found",
        });
      }
    }

    // ---------------------------------------------------
    // VALIDATE CUSTOMER
    // ---------------------------------------------------

    if (req.body.customer) {
      if (
        !req.body.customer.fullName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Customer full name is required",
        });
      }

      if (
        !req.body.customer.email
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Customer email is required",
        });
      }
    }

    // ---------------------------------------------------
    // VALIDATE AMOUNT
    // ---------------------------------------------------

    const updatedAmount =
      Number(
        existingInvoice.amount
      );

    if (
      Number.isNaN(
        updatedAmount
      ) ||
      updatedAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be a valid positive number",
      });
    }

    existingInvoice.amount =
      updatedAmount;

    // ---------------------------------------------------
    // TAX PERCENTAGE
    // ---------------------------------------------------

    const updatedTaxPercentage =
      existingInvoice.taxPercentage !==
        undefined &&
      existingInvoice.taxPercentage !==
        null
        ? Number(
            existingInvoice.taxPercentage
          )
        : 20;

    if (
      Number.isNaN(
        updatedTaxPercentage
      ) ||
      updatedTaxPercentage < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid tax percentage",
      });
    }

    existingInvoice.taxPercentage =
      updatedTaxPercentage;

    // ---------------------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------------------

    const allowedPaymentStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Cancelled",
      "Refunded",
    ];

    if (
      !allowedPaymentStatuses.includes(
        existingInvoice.paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status",
      });
    }

    // ---------------------------------------------------
    // UPDATE TAX
    // ---------------------------------------------------

    existingInvoice.tax =
      Number(
        (
          (existingInvoice.amount *
            existingInvoice.taxPercentage) /
          100
        ).toFixed(2)
      );

    // ---------------------------------------------------
    // UPDATE TOTAL
    // ---------------------------------------------------

    existingInvoice.totalAmount =
      Number(
        (
          existingInvoice.amount +
          existingInvoice.tax
        ).toFixed(2)
      );

    // ---------------------------------------------------
    // UPDATE PAYMENT / INVOICE STATUS
    // ---------------------------------------------------

    if (
      existingInvoice.paymentStatus ===
      "Paid"
    ) {
      existingInvoice.status =
        "Paid";

      if (
        !existingInvoice.paidAt
      ) {
        existingInvoice.paidAt =
          new Date();
      }
    }

    if (
      existingInvoice.paymentStatus ===
      "Cancelled"
    ) {
      existingInvoice.status =
        "Cancelled";
    }

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    await existingInvoice.save();

    // ---------------------------------------------------
    // GET UPDATED INVOICE
    // ---------------------------------------------------

    const updatedInvoice =
      await Invoice.findById(id)
        .populate("conferenceId");

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(
      "Update Invoice Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update invoice",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

exports.updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      paymentStatus,
    } = req.body;

    // ---------------------------------------------------
    // VALIDATE ID
    // ---------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    // ---------------------------------------------------
    // VALIDATE PAYMENT STATUS
    // ---------------------------------------------------

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Cancelled",
      "Refunded",
    ];

    if (
      !allowedStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status",
      });
    }

    // ---------------------------------------------------
    // FIND INVOICE
    // ---------------------------------------------------

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    // ---------------------------------------------------
    // UPDATE PAYMENT STATUS
    // ---------------------------------------------------

    invoice.paymentStatus =
      paymentStatus;

    // ---------------------------------------------------
    // UPDATE INVOICE STATUS
    // ---------------------------------------------------

    if (
      paymentStatus === "Paid"
    ) {
      invoice.status =
        "Paid";

      invoice.paidAt =
        new Date();
    }

    if (
      paymentStatus === "Cancelled"
    ) {
      invoice.status =
        "Cancelled";
    }

    if (
      paymentStatus === "Pending"
    ) {
      invoice.status =
        "Pending";

      invoice.paidAt = null;
    }

    if (
      paymentStatus === "Failed"
    ) {
      invoice.paidAt = null;

      if (
        invoice.status === "Paid"
      ) {
        invoice.status =
          "Pending";
      }
    }

    if (
      paymentStatus === "Refunded"
    ) {
      invoice.paidAt = null;

      if (
        invoice.status === "Paid"
      ) {
        invoice.status =
          "Pending";
      }
    }

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    await invoice.save();

    // ---------------------------------------------------
    // GET UPDATED INVOICE
    // ---------------------------------------------------

    const updatedInvoice =
      await Invoice.findById(id)
        .populate("conferenceId");

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Payment status updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(
      "Update Payment Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update payment status",
      error: error.message,
    });
  }
};

// =====================================================
// MARK INVOICE AS PAID
// =====================================================

exports.markInvoiceAsPaid = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ---------------------------------------------------
    // VALIDATE ID
    // ---------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    // ---------------------------------------------------
    // FIND INVOICE
    // ---------------------------------------------------

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    // ---------------------------------------------------
    // MARK AS PAID
    // ---------------------------------------------------

    invoice.paymentStatus =
      "Paid";

    invoice.status =
      "Paid";

    invoice.paidAt =
      new Date();

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    await invoice.save();

    // ---------------------------------------------------
    // GET UPDATED INVOICE
    // ---------------------------------------------------

    const updatedInvoice =
      await Invoice.findById(id)
        .populate("conferenceId");

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Invoice marked as paid successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(
      "Mark Invoice Paid Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark invoice as paid",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE INVOICE
// =====================================================

exports.deleteInvoice = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ---------------------------------------------------
    // VALIDATE ID
    // ---------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    // ---------------------------------------------------
    // DELETE INVOICE
    // ---------------------------------------------------

    const invoice =
      await Invoice.findByIdAndDelete(
        id
      );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Invoice deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Invoice Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete invoice",
      error: error.message,
    });
  }
};











exports.downloadInvoicePdf = async (req, res) => {
  let browser;

  try {
    const puppeteer = await import("puppeteer-core");

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const html = invoiceTemplate(invoice);

    browser = await puppeteer.default.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    const invoiceNumber =
      invoice.invoiceNumber ||
      invoice.invoiceId ||
      invoice._id.toString();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="GlobalScion-Invoice-${invoiceNumber}.pdf"`
    );

    res.setHeader("Content-Length", pdf.length);

    return res.send(pdf);
  } catch (error) {
    console.error("Download Invoice PDF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice PDF",
      error: error.message,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Browser close error:", closeError);
      }
    }
  }
};