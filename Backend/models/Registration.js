const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      enum: ["Mr", "Mrs", "Ms", "Dr", "Prof"],
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
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
      required: true,
      trim: true,
    },

    conference: {
      conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conference",
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      date: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    registration: {
      category: {
        type: String,
        required: true,
        enum: ["Academic","Business","Others", "Student"]
      },

      option: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        default: "EUR",
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registrationSchema);