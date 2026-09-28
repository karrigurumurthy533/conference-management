const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },

        stack: {
            type: String,
        },

        method: {
            type: String,
        },

        url: {
            type: String,
        },

        statusCode: {
            type: Number,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ErrorLog", errorLogSchema);