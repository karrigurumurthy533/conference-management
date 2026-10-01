const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const AppError = require("./utils/AppError");
const router = require("./router");
const errorLog = require("./models/errorLog");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        environment: process.env.NODE_ENV,
    });
});

app.use("/api/v1", router);

app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    try {
        await errorLog.create({
            message: err.message || "Unknown error",
            stack: err.stack || null,
            method: req.method,
            url: req.originalUrl,
            statusCode,
            userId: req.role?._id || null,
        });
    } catch (logError) {
        console.error("Error log save failed:", logError);
    }

    res.status(statusCode).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? err.isOperational
                    ? err.message
                    : "Internal Server Error"
                : err.message,
    });
});

module.exports = app;