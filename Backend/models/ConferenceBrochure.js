
const mongoose = require("mongoose");

const conferenceBrochureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },

    file: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ConferenceBrochure",
  conferenceBrochureSchema
);
