const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
    {
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
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            enum: ["admin", "employee"],
            lowercase: true,
            trim: true,
        },

        active: {
            type: Boolean,
            default: true,
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "verified"],
            default: "verified",
        },

        department: {
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

        designation: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            trim: true,
        },

        assignedConference: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conference",
            default: null,
        },

        twoFactorEnabled: {
            type: Boolean,
            default: false,
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

module.exports = mongoose.model("Roles", rolesSchema);