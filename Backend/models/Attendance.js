const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      required: true,
    },

    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    attendeeName: {
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

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },

    checkInMethod: {
      type: String,
      enum: ["QR", "Manual"],
      default: "Manual",
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  {
    conferenceId: 1,
    registrationId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);