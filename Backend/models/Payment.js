const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },

    conferenceId: {
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

    // Payer Details
    payer: {
      name: {
        type: String,
        trim: true,
        required: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
      },

      phone: {
        type: String,
        trim: true,
        required: true,
      },
    },

    // Amount
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    originalAmount: {
      type: Number,
      default: null,
    },

    originalCurrency: {
      type: String,
      default: null,
      uppercase: true,
    },

    conversionRate: {
      type: Number,
      default: null,
    },

    // Razorpay Details
    razorpay: {
      orderId: {
        type: String,
        required: true,
        index: true,
      },

      paymentId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      signature: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Created",
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
        "Partially Refunded",
      ],
      default: "Pending",
      index: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Optional Razorpay response data
    razorpayData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);