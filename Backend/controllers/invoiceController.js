const mongoose = require("mongoose");

const Invoice = require("../models/Invoice");
const Conference = require("../models/conference");
const BankAccount = require("../models/BankAccount");

const invoiceTemplate = require("../utils/invoiceTemplate");
const {
  getBrowser,
} = require("../utils/pdfBrowser");

/* =========================================================
   OBJECT ID VALIDATION
========================================================= */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/* =========================================================
   CREATE INVOICE
========================================================= */

exports.createInvoice = async (req, res) => {
  try {
    const {
      invoiceDate,
      customer,
      conferenceId,
      amount,
      taxPercentage,
      currency,
      description,
    } = req.body;

    /* -----------------------------------------------------
       VALIDATE CONFERENCE ID
    ----------------------------------------------------- */

    if (
      !conferenceId ||
      !isValidObjectId(conferenceId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid conferenceId is required",
      });
    }

    /* -----------------------------------------------------
       CHECK CONFERENCE
    ----------------------------------------------------- */

    const conference =
      await Conference.findById(conferenceId);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    /* -----------------------------------------------------
       VALIDATE CUSTOMER
    ----------------------------------------------------- */

    if (!customer?.fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer full name is required",
      });
    }

    if (!customer?.email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    /* -----------------------------------------------------
       VALIDATE AMOUNT
    ----------------------------------------------------- */

    const invoiceAmount = Number(amount);

    if (
      !Number.isFinite(invoiceAmount) ||
      invoiceAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invoice amount must be greater than 0",
      });
    }

    /* -----------------------------------------------------
       TAX PERCENTAGE
    ----------------------------------------------------- */

    const percentage = Number(taxPercentage);

    const finalTaxPercentage =
      Number.isFinite(percentage) &&
      percentage >= 0
        ? percentage
        : 0;

    /* -----------------------------------------------------
       CURRENCY
    ----------------------------------------------------- */

    const allowedCurrencies = [
      "USD",
      "GBP",
      "EUR",
      "INR",
    ];

    const finalCurrency =
      String(currency || "USD").toUpperCase();

    if (
      !allowedCurrencies.includes(
        finalCurrency
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency",
      });
    }

    /* -----------------------------------------------------
       FIND ACTIVE BANK ACCOUNT
       
       IMPORTANT:
       We don't store bank details in Invoice.
       Only bankAccountId is stored.
    ----------------------------------------------------- */

    const bankAccount =
      await BankAccount.findOne({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    if (!bankAccount) {
      return res.status(400).json({
        success: false,
        message:
          "No active bank account configured",
      });
    }

    /* -----------------------------------------------------
       CREATE INVOICE
    ----------------------------------------------------- */

    const invoice = new Invoice({
      invoiceDate:
        invoiceDate || new Date(),

      customer: {
        fullName:
          customer.fullName.trim(),

        email:
          customer.email.trim(),

        phone:
          customer.phone?.trim() || "",

        country:
          customer.country?.trim() || "",

        address:
          customer.address?.trim() || "",

        affiliation:
          customer.affiliation?.trim() || "",
      },

      conferenceId,

      /* -----------------------------------------------
         ONLY REFERENCE IS STORED
      ----------------------------------------------- */

      bankAccountId:
        bankAccount._id,

      description:
        description?.trim() || "",

      amount:
        invoiceAmount,

      taxPercentage:
        finalTaxPercentage,

      currency:
        finalCurrency,

      paymentStatus:
        "Pending",

      status:
        "Draft",
    });

    /* -----------------------------------------------------
       SAVE
       
       Invoice schema automatically calculates:
       - invoiceNumber
       - tax
       - totalAmount
    ----------------------------------------------------- */

    await invoice.save();

    /* -----------------------------------------------------
       POPULATE RESPONSE
    ----------------------------------------------------- */

    await invoice.populate([
      {
        path: "conferenceId",
      },
      {
        path: "bankAccountId",
      },
    ]);

    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message:
        "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(
      "CREATE INVOICE ERROR:",
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

/* =========================================================
   GET ALL INVOICES
========================================================= */

exports.getAllInvoices = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      status,
      paymentStatus,
      conferenceId,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage =
      Math.max(Number(page), 1);

    const itemsPerPage =
      Math.max(Number(limit), 1);

    const skip =
      (currentPage - 1) *
      itemsPerPage;

    const filter = {};

    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim(),
          "i"
        );

      filter.$or = [
        {
          invoiceNumber:
            searchRegex,
        },

        {
          "customer.fullName":
            searchRegex,
        },

        {
          "customer.email":
            searchRegex,
        },

        {
          "customer.phone":
            searchRegex,
        },

        {
          "customer.affiliation":
            searchRegex,
        },
      ];
    }

    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    if (status) {
      filter.status = status;
    }

    /* -----------------------------------------------------
       PAYMENT STATUS
    ----------------------------------------------------- */

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    /* -----------------------------------------------------
       CONFERENCE
    ----------------------------------------------------- */

    if (
      conferenceId &&
      isValidObjectId(conferenceId)
    ) {
      filter.conferenceId =
        conferenceId;
    }

    /* -----------------------------------------------------
       FETCH
    ----------------------------------------------------- */

    const [
      invoices,
      total,
    ] = await Promise.all([
      Invoice.find(filter)
        .populate(
          "conferenceId"
        )
        .populate(
          "bankAccountId"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage),

      Invoice.countDocuments(
        filter
      ),
    ]);

    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    return res.status(200).json({
      success: true,

      data: invoices,

      pagination: {
        total,

        page: currentPage,

        limit: itemsPerPage,

        totalPages:
          Math.ceil(
            total /
              itemsPerPage
          ),
      },
    });
  } catch (error) {
    console.error(
      "GET ALL INVOICES ERROR:",
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

/* =========================================================
   GET INVOICE BY ID
========================================================= */

exports.getInvoiceById = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    const invoice =
      await Invoice.findById(id)
        .populate(
          "conferenceId"
        )
        .populate(
          "bankAccountId"
        );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error(
      "GET INVOICE ERROR:",
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

/* =========================================================
   UPDATE INVOICE
========================================================= */

exports.updateInvoice = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    const {
      invoiceDate,
      customer,
      conferenceId,
      bankAccountId,
      description,
      amount,
      taxPercentage,
      currency,
      status,
      paymentStatus,
    } = req.body;

    /* -----------------------------------------------------
       INVOICE DATE
    ----------------------------------------------------- */

    if (
      invoiceDate !==
      undefined
    ) {
      invoice.invoiceDate =
        invoiceDate;
    }

    /* -----------------------------------------------------
       CUSTOMER
    ----------------------------------------------------- */

    if (customer) {
      invoice.customer = {
        fullName:
          customer.fullName?.trim() ||
          invoice.customer.fullName,

        email:
          customer.email?.trim() ||
          invoice.customer.email,

        phone:
          customer.phone?.trim() ||
          "",

        country:
          customer.country?.trim() ||
          "",

        address:
          customer.address?.trim() ||
          "",

        affiliation:
          customer.affiliation?.trim() ||
          "",
      };
    }

    /* -----------------------------------------------------
       CONFERENCE
    ----------------------------------------------------- */

    if (
      conferenceId !==
      undefined
    ) {
      if (
        !isValidObjectId(
          conferenceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conferenceId",
        });
      }

      const conference =
        await Conference.findById(
          conferenceId
        );

      if (!conference) {
        return res.status(404).json({
          success: false,
          message:
            "Conference not found",
        });
      }

      invoice.conferenceId =
        conferenceId;
    }

    /* -----------------------------------------------------
       BANK ACCOUNT
       
       Optional update.
    ----------------------------------------------------- */

    if (
      bankAccountId !==
      undefined
    ) {
      if (
        !isValidObjectId(
          bankAccountId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid bankAccountId",
        });
      }

      const bankAccount =
        await BankAccount.findById(
          bankAccountId
        );

      if (!bankAccount) {
        return res.status(404).json({
          success: false,
          message:
            "Bank account not found",
        });
      }

      invoice.bankAccountId =
        bankAccountId;
    }

    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    if (
      description !==
      undefined
    ) {
      invoice.description =
        description;
    }

    /* -----------------------------------------------------
       AMOUNT
    ----------------------------------------------------- */

    if (
      amount !==
      undefined
    ) {
      const newAmount =
        Number(amount);

      if (
        !Number.isFinite(
          newAmount
        ) ||
        newAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid invoice amount",
        });
      }

      invoice.amount =
        newAmount;
    }

    /* -----------------------------------------------------
       TAX %
    ----------------------------------------------------- */

    if (
      taxPercentage !==
      undefined
    ) {
      const newTaxPercentage =
        Number(
          taxPercentage
        );

      if (
        !Number.isFinite(
          newTaxPercentage
        ) ||
        newTaxPercentage < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid tax percentage",
        });
      }

      invoice.taxPercentage =
        newTaxPercentage;
    }

    /* -----------------------------------------------------
       CURRENCY
    ----------------------------------------------------- */

    if (
      currency !==
      undefined
    ) {
      const finalCurrency =
        String(
          currency
        ).toUpperCase();

      if (
        ![
          "USD",
          "GBP",
          "EUR",
          "INR",
        ].includes(
          finalCurrency
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid currency",
        });
      }

      invoice.currency =
        finalCurrency;
    }

    /* -----------------------------------------------------
       INVOICE STATUS
    ----------------------------------------------------- */

    if (
      status !==
      undefined
    ) {
      const allowedStatuses = [
        "Draft",
        "Issued",
        "Pending",
        "Paid",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid invoice status",
        });
      }

      invoice.status =
        status;
    }

    /* -----------------------------------------------------
       PAYMENT STATUS
    ----------------------------------------------------- */

    if (
      paymentStatus !==
      undefined
    ) {
      const allowedPaymentStatuses =
        [
          "Pending",
          "Paid",
          "Failed",
          "Cancelled",
          "Refunded",
        ];

      if (
        !allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment status",
        });
      }

      invoice.paymentStatus =
        paymentStatus;

      if (
        paymentStatus ===
        "Paid"
      ) {
        invoice.paidAt =
          new Date();

        invoice.status =
          "Paid";
      }
    }

    /* -----------------------------------------------------
       SAVE
       
       Schema recalculates:
       tax
       totalAmount
    ----------------------------------------------------- */

    await invoice.save();

    /* -----------------------------------------------------
       POPULATE
    ----------------------------------------------------- */

    await invoice.populate([
      {
        path: "conferenceId",
      },
      {
        path: "bankAccountId",
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(
      "UPDATE INVOICE ERROR:",
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

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

exports.updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const {
      paymentStatus,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

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

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    invoice.paymentStatus =
      paymentStatus;

    if (
      paymentStatus ===
      "Paid"
    ) {
      invoice.paidAt =
        new Date();

      invoice.status =
        "Paid";
    }

    await invoice.save();

    await invoice.populate([
      {
        path: "conferenceId",
      },
      {
        path: "bankAccountId",
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        "Payment status updated successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT STATUS ERROR:",
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

/* =========================================================
   MARK INVOICE AS PAID
========================================================= */

exports.markInvoiceAsPaid = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    invoice.paymentStatus =
      "Paid";

    invoice.status =
      "Paid";

    invoice.paidAt =
      new Date();

    await invoice.save();

    await invoice.populate([
      {
        path: "conferenceId",
      },
      {
        path: "bankAccountId",
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        "Invoice marked as paid",
      data: invoice,
    });
  } catch (error) {
    console.error(
      "MARK INVOICE PAID ERROR:",
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

/* =========================================================
   DELETE INVOICE
========================================================= */

exports.deleteInvoice = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invoice ID",
      });
    }

    const invoice =
      await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message:
          "Invoice not found",
      });
    }

    await Invoice.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Invoice deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE INVOICE ERROR:",
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

/* =========================================================
   DOWNLOAD INVOICE PDF
========================================================= */

/* =========================================================
   DOWNLOAD INVOICE PDF
========================================================= */

exports.downloadInvoicePdf = async (
  req,
  res
) => {
  let page = null;

  try {
    const { id } = req.params;

    /* -----------------------------------------------------
       VALIDATE ID
    ----------------------------------------------------- */

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }

    /* -----------------------------------------------------
       GET INVOICE
    ----------------------------------------------------- */

    const invoice =
      await Invoice.findById(id)
        .populate("conferenceId")
        .populate("bankAccountId")
        .lean();

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    /* -----------------------------------------------------
       CHECK BANK ACCOUNT
    ----------------------------------------------------- */

    if (!invoice.bankAccountId) {
      return res.status(400).json({
        success: false,
        message:
          "Bank account is not configured for this invoice",
      });
    }

    /* -----------------------------------------------------
       GENERATE HTML
    ----------------------------------------------------- */

    const html = invoiceTemplate(invoice);

    /* -----------------------------------------------------
       REUSE CHROMIUM
       
       IMPORTANT:
       Browser is NOT launched for every request.
    ----------------------------------------------------- */

    const browser = await getBrowser();

    /* -----------------------------------------------------
       CREATE PAGE
    ----------------------------------------------------- */

    page = await browser.newPage();

    /* -----------------------------------------------------
       SET HTML

       domcontentloaded is much faster than networkidle0
    ----------------------------------------------------- */

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    /* -----------------------------------------------------
       GENERATE PDF
    ----------------------------------------------------- */

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: false,

      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    res.set({
      "Content-Type": "application/pdf",

      "Content-Disposition":
        `attachment; filename="${invoice.invoiceNumber}.pdf"`,

      "Content-Length": pdf.length,

      "Cache-Control":
        "private, max-age=300",
    });

    return res.end(pdf);

  } catch (error) {
    console.error(
      "DOWNLOAD INVOICE PDF ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate invoice PDF",
      error: error.message,
    });

  } finally {
    /* -----------------------------------------------------
       CLOSE ONLY PAGE

       DO NOT CLOSE BROWSER
    ----------------------------------------------------- */

    if (page) {
      try {
        await page.close();
      } catch (pageError) {
        console.error(
          "PDF PAGE CLOSE ERROR:",
          pageError
        );
      }
    }
  }
};

