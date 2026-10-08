const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
    {
        // =====================================================
        // BASIC INFORMATION
        // =====================================================

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

        // =====================================================
        // AUTHENTICATION
        // =====================================================

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        // Main authentication role
        // Frontend/controller does not need to send this.
        // MongoDB will automatically store "Employee".
        role: {
            type: String,
            default: "Employee",
            trim: true,
        },

        // =====================================================
        // EMPLOYEE TYPE
        // =====================================================

        employeeType: {
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

        // =====================================================
        // CONTACT
        // =====================================================

        phoneNumber: {
            type: String,
            trim: true,
        },

        // =====================================================
        // ASSIGNED CONFERENCES
        // =====================================================

        assignedConferences: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Conference",
            },
        ],

        // =====================================================
        // STATUS
        // =====================================================

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            lowercase: true,
            trim: true,
        },

        // =====================================================
        // EMPLOYEE DETAILS
        // =====================================================

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

        // =====================================================
        // PERMISSIONS
        // =====================================================

        permissions: {
            type: [String],
            default: [],
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        lastLogout: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// =========================================================
// PASSWORD HASHING
// =========================================================

employeeSchema.pre("save", async function () {
    // If password was not changed, don't hash again
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// =========================================================
// PASSWORD COMPARE METHOD
// =========================================================

employeeSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// =========================================================
// EXPORT MODEL
// =========================================================

module.exports = mongoose.model("Employee", employeeSchema);