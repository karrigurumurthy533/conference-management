
const mongoose = require("mongoose");
const PaymentReceipt = require("../models/PaymentReceipt");
const ReceiptCounter = require("../models/ReceiptCounter");
const paymentReceiptTemplate = require("../utils/paymentReceiptTemplate");
const { getBrowser } = require("../utils/pdfBrowser");
const RECEIPT_NUMBER_PREFIX = "ICHMPSUMT27";

async function generateReceiptNumber() {
  const counterId = "paymentReceipt";
  const counter = await ReceiptCounter.findById(counterId).lean();

  if (!counter) {
    const existingReceipts = await PaymentReceipt.find({
      receiptNumber: new RegExp("^" + RECEIPT_NUMBER_PREFIX + "-\\d+$"),
    }).select("receiptNumber").lean();
    const highestExistingNumber = existingReceipts.reduce((highest, receipt) => {
      const suffix = Number(receipt.receiptNumber.split("-").pop());
      return Number.isSafeInteger(suffix) ? Math.max(highest, suffix) : highest;
    }, 0);

    try {
      await ReceiptCounter.findOneAndUpdate(
        { _id: counterId },
        { $setOnInsert: { sequence: highestExistingNumber } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  const nextCounter = await ReceiptCounter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { sequence: 1 } },
    { new: true }
  );
  return RECEIPT_NUMBER_PREFIX + "-" + nextCounter.sequence;
}

// CREATE RECEIPT - POST



exports.createPaymentReceipt = async (req, res) => {
  try {
    const body = req.body || {};

    console.log("========== CREATE PAYMENT RECEIPT ==========");
    console.log("Request URL:", req.originalUrl);
    console.log("Request body:", JSON.stringify(body, null, 2));

    const {
      conference,
      conferenceDates,
      conferenceMode,
      companyCountry,
      companyPhone,
      companyEmail,
      receiptNumber,
      paymentDate,
      paymentMethod,
      transactionId,
      billing,
      shipping,
      items,
      totals,
      status,
      supportEmail,
      terms,
    } = body;

    // ==========================================
    // 1. NORMALIZE CONFERENCE TITLE
    // ==========================================

    const conferenceTitle =
      typeof body.conferenceTitle === "string"
        ? body.conferenceTitle.trim()
        : typeof body.title === "string"
          ? body.title.trim()
          : "";

    if (!conferenceTitle) {
      console.error(
        "Missing conferenceTitle. Received keys:",
        Object.keys(body)
      );

      return res.status(400).json({
        success: false,
        message: "Conference title is required",
        receivedFields: Object.keys(body),
      });
    }

    // ==========================================
    // 2. REQUIRED FIELDS VALIDATION
    // ==========================================

    const requiredFields = [];

    if (!conference) requiredFields.push("conference");
    if (!conferenceDates) requiredFields.push("conferenceDates");
    if (!conferenceMode?.trim?.()) requiredFields.push("conferenceMode");
    if (!companyCountry?.trim?.()) requiredFields.push("companyCountry");
    if (!companyPhone?.trim?.()) requiredFields.push("companyPhone");
    if (!companyEmail?.trim?.()) requiredFields.push("companyEmail");
    if (!paymentDate) requiredFields.push("paymentDate");
    if (!paymentMethod?.trim?.()) requiredFields.push("paymentMethod");

    if (!billing?.name?.trim?.()) requiredFields.push("billing.name");

    if (!Array.isArray(items) || items.length === 0) {
      requiredFields.push("items");
    }

    if (
      !totals ||
      typeof totals !== "object" ||
      Array.isArray(totals)
    ) {
      requiredFields.push("totals");
    }

    if (!status) requiredFields.push("status");

    if (requiredFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required receipt fields.",
        missingFields: requiredFields,
      });
    }

    // ==========================================
    // 3. CONFERENCE ID VALIDATION
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(conference)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conference ID.",
      });
    }

    // ==========================================
    // 4. EMAIL VALIDATION
    // ==========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const normalizedCompanyEmail = companyEmail.trim().toLowerCase();
    const normalizedBillingEmail = String(billing?.email || "").trim().toLowerCase();
    const normalizedShippingEmail = String(shipping?.email || "").trim().toLowerCase();

    if (
      !emailRegex.test(normalizedCompanyEmail) ||
      (normalizedBillingEmail && !emailRegex.test(normalizedBillingEmail)) ||
      (normalizedShippingEmail && !emailRegex.test(normalizedShippingEmail))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid email addresses.",
      });
    }

    // ==========================================
    // 5. PAYMENT DATE VALIDATION
    // ==========================================

    const parsedPaymentDate = new Date(paymentDate);

    if (Number.isNaN(parsedPaymentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment date.",
      });
    }

    // ==========================================
    // 6. STATUS VALIDATION - MATCH SCHEMA
    // ==========================================

    const allowedStatuses = [
      "Paid",
      "Pending",
      "Downloaded",
      "Send",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receipt status.",
        allowedStatuses,
      });
    }

    // ==========================================
    // 7. CONFERENCE MODE VALIDATION
    // ==========================================

    const allowedModes = ["Webinar", "In-Person", "Hybrid"];

    if (!allowedModes.includes(conferenceMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conference mode.",
        allowedModes,
      });
    }

    // ==========================================
    // 8. PAYMENT METHOD VALIDATION
    // ==========================================

    const allowedPaymentMethods = [
      "Debit/Credit Card",
      "Bank Transfer",
      "UPI",
      "PayPal",
      "Cash",
      "Other",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
        allowedPaymentMethods,
      });
    }

    // ==========================================
    // 9. ITEM AND CURRENCY VALIDATION
    // ==========================================

    const allowedCurrencies = [
      "EUR",
      "GBP",
      "USD",
      "INR",
      "AUD",
      "CAD",
    ];

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (
        !item ||
        typeof item.description !== "string" ||
        !item.description.trim() ||
        !allowedCurrencies.includes(item.currency) ||
        item.amount === "" ||
        item.amount === null ||
        item.amount === undefined ||
        !Number.isFinite(Number(item.amount)) ||
        Number(item.amount) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Receipt item ${index + 1} has an invalid description, currency, or amount.`,
        });
      }
    }

    // ==========================================
    // 10. TOTALS VALIDATION
    // ==========================================

    for (const [currency, amount] of Object.entries(totals)) {
      if (
        !allowedCurrencies.includes(currency) ||
        amount === "" ||
        amount === null ||
        amount === undefined ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid receipt total for currency: ${currency}.`,
        });
      }
    }

    // ==========================================
    // 11. DUPLICATE RECEIPT NUMBER CHECK
    // ==========================================

    const normalizedReceiptNumber = await generateReceiptNumber();

    const existingReceipt = await PaymentReceipt.findOne({
      receiptNumber: normalizedReceiptNumber,
    });

    if (existingReceipt) {
      return res.status(409).json({
        success: false,
        message: "Receipt number already exists.",
      });
    }

    // ==========================================
    // 12. CREATE RECEIPT
    // ==========================================

    const receipt = await PaymentReceipt.create({
      conference,
      conferenceTitle,
      conferenceDates: String(conferenceDates).trim(),
      conferenceMode,

      companyCountry: companyCountry.trim(),
      companyPhone: companyPhone.trim(),
      companyEmail: normalizedCompanyEmail,
      supportEmail: String(supportEmail || "support@globalscion.org").trim(),
      terms: String(terms || "").trim(),

      receiptNumber: normalizedReceiptNumber,
      paymentDate: parsedPaymentDate,
      paymentMethod,
      transactionId: String(transactionId || "").trim(),

      billing: {
        name: billing.name.trim(),
        address: String(billing.address || "").trim(),
        country: String(billing.country || "United States").trim(),
        countryCode: String(billing.countryCode || "+1").trim(),
        phone: String(billing.phone || "").trim(),
        email: normalizedBillingEmail,
      },

      shipping: {
        name: String(shipping.name || "").trim(),
        address: String(shipping.address || "").trim(),
        country: String(shipping.country || "United States").trim(),
        countryCode: String(shipping.countryCode || "+1").trim(),
        phone: String(shipping.phone || "").trim(),
        email: normalizedShippingEmail,
      },

      items: items.map((item) => ({
        description: item.description.trim(),
        currency: item.currency,
        amount: Number(item.amount),
      })),

      totals: Object.fromEntries(
        Object.entries(totals).map(([currency, amount]) => [
          currency,
          Number(amount),
        ])
      ),

      status,
    });

    // ==========================================
    // 13. SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Payment receipt created successfully.",
      data: receipt,
    });
  } catch (error) {
    console.error("Create payment receipt error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Receipt number already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${error.path}.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create payment receipt.",
    });
  }
};



// GET ALL RECEIPTS - GET
exports.getAllPaymentReceipts = async (req, res) => {
  try {
    const {
      search,
      status,
      conference,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (conference) {
      if (!mongoose.Types.ObjectId.isValid(conference)) {
        return res.status(400).json({
          success: false,
          message: "Invalid conference ID.",
        });
      }

      filter.conference = conference;
    }

    if (search?.trim()) {
      const keyword = search.trim();

      filter.$or = [
        { receiptNumber: { $regex: keyword, $options: "i" } },
        { conferenceTitle: { $regex: keyword, $options: "i" } },
        { "billing.name": { $regex: keyword, $options: "i" } },
        { "billing.email": { $regex: keyword, $options: "i" } },
        { transactionId: { $regex: keyword, $options: "i" } },
      ];
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const skip = (currentPage - 1) * pageLimit;

    const [receipts, total] = await Promise.all([
      PaymentReceipt.find(filter)
        .populate("conference", "title startDate endDate location mode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      PaymentReceipt.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Payment receipts fetched successfully.",
      count: receipts.length,
      total,
      page: currentPage,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
      data: receipts,
    });
  } catch (error) {
    console.error("Get payment receipts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment receipts.",
    });
  }
};

// GET RECEIPT BY ID - GET
exports.getPaymentReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receipt ID.",
      });
    }

    const receipt = await PaymentReceipt.findById(id)
      .populate("conference", "title startDate endDate location mode")
      .lean();

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("Get payment receipt error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment receipt.",
    });
  }
};

// UPDATE RECEIPT - PUT
exports.updatePaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receipt ID.",
      });
    }

    const existingReceipt = await PaymentReceipt.findById(id);

    if (!existingReceipt) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found.",
      });
    }

    const allowedFields = [
      "conference",
      "conferenceTitle",
      "conferenceDates",
      "conferenceMode",
      "companyCountry",
      "companyPhone",
      "companyEmail",
      "supportEmail",
      "terms",
      "receiptNumber",
      "paymentDate",
      "paymentMethod",
      "transactionId",
      "billing",
      "shipping",
      "items",
      "totals",
      "status",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    });

    if (
      updateData.conference &&
      !mongoose.Types.ObjectId.isValid(updateData.conference)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid conference ID.",
      });
    }

    if (updateData.receiptNumber) {
      const duplicate = await PaymentReceipt.findOne({
        receiptNumber: updateData.receiptNumber.trim(),
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Receipt number already exists.",
        });
      }
    }

    const updatedReceipt = await PaymentReceipt.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("conference", "title startDate endDate location mode");

    return res.status(200).json({
      success: true,
      message: "Payment receipt updated successfully.",
      data: updatedReceipt,
    });
  } catch (error) {
    console.error("Update payment receipt error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Receipt number already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update payment receipt.",
    });
  }
};

// DELETE RECEIPT - DELETE
exports.deletePaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receipt ID.",
      });
    }

    const receipt = await PaymentReceipt.findByIdAndDelete(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment receipt deleted successfully.",
      data: receipt,
    });
  } catch (error) {
    console.error("Delete payment receipt error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete payment receipt.",
    });
  }
};




// DOWNLOAD RECEIPT AS PDF - GET
exports.downloadPaymentReceipt = async (req, res) => {
  let page;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid receipt ID." });
    }
    const receipt = await PaymentReceipt.findById(id)
      .populate("conference", "title startDate endDate location mode")
      .lean();
    if (!receipt) {
      return res.status(404).json({ success: false, message: "Payment receipt not found." });
    }

    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setContent(paymentReceiptTemplate(receipt), { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      format: "A4", printBackground: true, preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    const safeNumber = String(receipt.receiptNumber || "receipt").replace(/[^a-zA-Z0-9_-]/g, "_");
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Receipt-' + safeNumber + '.pdf"',
      "Content-Length": pdf.length,
      "Cache-Control": "private, max-age=300",
    });
    return res.end(pdf);
  } catch (error) {
    console.error("Download payment receipt PDF error:", error);
    if (!res.headersSent) return res.status(500).json({ success: false, message: "Failed to generate receipt PDF." });
    return res.end();
  } finally {
    if (page) await page.close().catch(() => {});
  }
};


