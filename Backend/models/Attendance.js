const mongoose = require("mongoose");

const attendanceDaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half Day"],
      default: "Present",
    },

    workingHours: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    conference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conference",
      default: null,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },

    days: {
      type: [attendanceDaySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// One employee can have only one document for one month
attendanceSchema.index(
  {
    employee: 1,
    year: 1,
    month: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);