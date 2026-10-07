const mongoose = require("mongoose");

/* =========================================================
   BANK SCHEMA
========================================================= */

const bankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      trim: true,
    },

    accountName: {
      type: String,
      trim: true,
    },

    accountNumber: {
      type: String,
      trim: true,
    },

    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
    },

    swiftCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   CUSTOMER SCHEMA
========================================================= */

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   INVOICE SCHEMA
========================================================= */

const invoiceSchema = new mongoose.Schema(
  {
    /* -----------------------------------------------------
       INVOICE NUMBER
    ----------------------------------------------------- */

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    /* -----------------------------------------------------
       INVOICE DATE
    ----------------------------------------------------- */

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    /* -----------------------------------------------------
       CUSTOMER
    ----------------------------------------------------- */

    customer: {
      type: customerSchema,
      required: true,
    },

    /* -----------------------------------------------------
       CONFERENCE
    ----------------------------------------------------- */

    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
      index: true,
    },

    /* -----------------------------------------------------
       AMOUNT
    ----------------------------------------------------- */

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* -----------------------------------------------------
       TAX
    ----------------------------------------------------- */

    taxPercentage: {
      type: Number,
      default: 20,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* -----------------------------------------------------
       TOTAL
    ----------------------------------------------------- */

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* -----------------------------------------------------
       CURRENCY
    ----------------------------------------------------- */

    currency: {
      type: String,
      enum: ["USD", "GBP", "EUR", "INR"],
      default: "USD",
      uppercase: true,
      trim: true,
    },

    /* -----------------------------------------------------
       PAYMENT STATUS
    ----------------------------------------------------- */

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
      index: true,
    },

    /* -----------------------------------------------------
       BANK DETAILS
    ----------------------------------------------------- */

    bank: {
      type: bankSchema,

      default: () => ({}),
    },

    /* -----------------------------------------------------
       INVOICE STATUS
    ----------------------------------------------------- */

    status: {
      type: String,
      enum: [
        "Draft",
        "Issued",
        "Pending",
        "Paid",
        "Cancelled",
      ],
      default: "Draft",
      index: true,
    },

    /* -----------------------------------------------------
       PAID DATE
    ----------------------------------------------------- */

    paidAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   AUTO GENERATE INVOICE NUMBER + CALCULATE TAX
========================================================= */

invoiceSchema.pre("validate", async function () {
  /*
   * Generate invoice number only for new invoices.
   *
   * Format:
   * INV-0001
   * INV-0002
   * INV-0003
   */

  if (this.isNew && !this.invoiceNumber) {
    const Invoice = this.constructor;

    const lastInvoice = await Invoice.findOne({
      invoiceNumber: {
        $regex: /^INV-\d+$/,
      },
    })
      .sort({
        createdAt: -1,
      })
      .select("invoiceNumber")
      .lean();

    let nextNumber = 1;

    if (lastInvoice?.invoiceNumber) {
      const match =
        lastInvoice.invoiceNumber.match(/^INV-(\d+)$/);

      if (match) {
        const lastNumber = parseInt(match[1], 10);

        if (Number.isFinite(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    this.invoiceNumber = `INV-${String(nextNumber).padStart(
      4,
      "0"
    )}`;
  }

  /* -------------------------------------------------------
     CALCULATE TAX
  ------------------------------------------------------- */

  const amount = Number(this.amount) || 0;

  const taxPercentage =
    this.taxPercentage !== undefined &&
    this.taxPercentage !== null
      ? Number(this.taxPercentage)
      : 20;

  this.taxPercentage = Math.max(
    taxPercentage,
    0
  );

  /* -------------------------------------------------------
     TAX AMOUNT
  ------------------------------------------------------- */

  this.tax = Number(
    (
      (amount * this.taxPercentage) /
      100
    ).toFixed(2)
  );

  /* -------------------------------------------------------
     TOTAL AMOUNT
  ------------------------------------------------------- */

  this.totalAmount = Number(
    (
      amount + this.tax
    ).toFixed(2)
  );
});

/* =========================================================
   MODEL
========================================================= */

const Invoice =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;