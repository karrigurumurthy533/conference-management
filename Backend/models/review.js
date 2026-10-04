const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewerImage: {
      type: String,
      required: [true, "Reviewer image is required"],
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 100,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },

    description: {
      type: String,
      required: [true, "Review description is required"],
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Review", reviewSchema);