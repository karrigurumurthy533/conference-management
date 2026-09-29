const mongoose = require("mongoose");

const abstractSchema = new mongoose.Schema(
  {
    presenter: {
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
    },

    abstractDetails: {
      category: {
        type: String,
        required: true,
        trim: true,
      },

      conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conference",
        required: true,
      },
    },

    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },

      fullPostalAddress: {
        type: String,
        required: true,
        trim: true,
      },
    },

    abstractFile: {
      fileUrl: {
        type: String,
        required: true,
        trim: true,
      },

      originalFileName: {
        type: String,
        required: true,
        trim: true,
      },

      fileType: {
        type: String,
        required: true,
        enum: ["pdf", "doc", "docx"],
      },

      fileSize: {
        type: Number,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Accepted",
        "Rejected",
        "Withdrawn",
      ],
      default: "Submitted",
    },

    reviewStatus: {
      type: String,
      enum: ["Pending", "Reviewed"],
      default: "Pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Abstract", abstractSchema);