const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    speakerType: {
      type: String,
      enum: [
        "Keynote Speaker",
        "Invited Speaker",
        "Panelist",
        "Plenary Speaker",
        "Session Chair",
        "Workshop Speaker",
      ],
      default: "Invited Speaker",
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Speaker", speakerSchema);