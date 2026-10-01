const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            enum: [
                "event manager",
                "coordinator",
                "marketing",
                "webiner",
            ],
            lowercase: true,
            trim: true,
        },

        phoneNumber: {
            type: String,
            trim: true,
        },

        assignedConferences: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Conference",
            },
        ],

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            lowercase: true,
            trim: true,
        },

        department: {
            type: String,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
            trim: true,
        },

        about: {
            type: String,
            trim: true,
        },

        permissions: {
            type: [String],
            default: [],
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Employee", employeeSchema);