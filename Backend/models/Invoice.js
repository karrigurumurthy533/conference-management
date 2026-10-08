const mongoose = require("mongoose");

/* =========================================================
   CUSTOMER SCHEMA
========================================================= */

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Customer full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    affiliation: {
      type: String,
      default: "",
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
      unique: true,
      index: true,
      trim: true,
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
      required: [true, "Conference is required"],
      index: true,
    },

    /* -----------------------------------------------------
       BANK ACCOUNT REFERENCE

       Bank details are NOT duplicated inside invoice.

       Invoice only stores which bank account was used.
    ----------------------------------------------------- */

    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: [true, "Bank account is required"],
      index: true,
    },

    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* -----------------------------------------------------
       AMOUNT
    ----------------------------------------------------- */

    amount: {
      type: Number,
      required: [true, "Invoice amount is required"],
      min: [0, "Invoice amount cannot be negative"],
    },

    /* -----------------------------------------------------
       TAX PERCENTAGE
    ----------------------------------------------------- */

    taxPercentage: {
      type: Number,
      default: 20,
      min: [0, "Tax percentage cannot be negative"],
    },

    /* -----------------------------------------------------
       TAX
    ----------------------------------------------------- */

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* -----------------------------------------------------
       TOTAL AMOUNT
    ----------------------------------------------------- */

    totalAmount: {
      type: Number,
      default: 0,
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
       INVOICE STATUS
    ----------------------------------------------------- */



    
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   PRE VALIDATE
========================================================= */

invoiceSchema.pre("validate", async function () {
  /* -------------------------------------------------------
     GENERATE INVOICE NUMBER
  ------------------------------------------------------- */

  if (!this.invoiceNumber) {
    const lastInvoice = await this.constructor
      .findOne({
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
        lastInvoice.invoiceNumber.match(
          /^INV-(\d+)$/
        );

      if (match) {
        nextNumber =
          Number(match[1]) + 1;
      }
    }

    this.invoiceNumber =
      `INV-${String(nextNumber).padStart(4, "0")}`;
  }

  /* -------------------------------------------------------
     CALCULATE TAX
  ------------------------------------------------------- */

  const amount =
    Number(this.amount) || 0;

  const taxPercentage =
    Number(this.taxPercentage) || 0;

  const calculatedTax =
    (amount * taxPercentage) / 100;

  this.tax =
    Math.round(calculatedTax * 100) / 100;

  /* -------------------------------------------------------
     CALCULATE TOTAL
  ------------------------------------------------------- */

  this.totalAmount =
    Math.round(
      (amount + this.tax) * 100
    ) / 100;
});

/* =========================================================
   EXPORT
========================================================= */

const Invoice =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;