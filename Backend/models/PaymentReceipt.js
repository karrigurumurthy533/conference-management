
const mongoose = require("mongoose");

const paymentReceiptSchema = new mongoose.Schema(
  {
    // Conference Details
    conference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
      index: true,
    },

    conferenceTitle: {
      type: String,
      trim: true,
      required: true,
    },

    conferenceDates: {
      type: String,
      trim: true,
      required: true,
    },

    conferenceMode: {
      type: String,
      enum: ["Webinar", "In-Person", "Hybrid"],
      default: "Webinar",
      required: true,
    },

    // Organization Details
    companyCountry: {
      type: String,
      trim: true,
      default: "United Kingdom",
    },

    companyPhone: {
      type: String,
      trim: true,
      default: "+44 3308088650",
    },

    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "info@globalscion.com",
    },

    supportEmail: { type: String, trim: true, default: "support@globalscion.org" },
    terms: { type: String, trim: true, default: "All online payments through payment gateways are accepted after our customer agrees to our Terms and Conditions." },

    // Receipt Details
    receiptNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    // Payment Details
    paymentDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "Debit/Credit Card",
        "Bank Transfer",
        "UPI",
        "PayPal",
        "Cash",
        "Other",
      ],
      default: "Debit/Credit Card",
      required: true,
    },

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    // Billing Details
    billing: {
      name: {
        type: String,
        trim: true,
        required: true,
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "United States",
      },

      countryCode: {
        type: String,
        trim: true,
        default: "+1",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },

    // Shipping Details
    shipping: {
      name: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "United States",
      },

      countryCode: {
        type: String,
        trim: true,
        default: "+1",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },

    // Receipt Items
    items: [
      {
        description: {
          type: String,
          trim: true,
          required: true,
        },

        currency: {
          type: String,
          enum: ["EUR", "GBP", "USD", "INR", "AUD", "CAD"],
          default: "EUR",
          required: true,
        },

        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Currency-wise Totals
    totals: {
      type: Map,
      of: {
        type: Number,
        min: 0,
      },
      default: {},
    },

    // Receipt Status
    status: {
      type: String,
      enum: ["Paid", "Pending", "Downloaded","Send"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PaymentReceipt",
  paymentReceiptSchema
);

