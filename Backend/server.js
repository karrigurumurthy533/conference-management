require("dotenv").config();

const http = require("http");

const app = require("./app");

const {
    connectDatabase,
    closeDatabase,
} = require("./config/db");

const PORT = process.env.PORT || 8000;

let server;

const startServer = async () => {
    try {
        await connectDatabase();

        server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Production server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down server...`);

    if (server) {
        server.close(async () => {
            await closeDatabase();

            console.log("Server closed successfully");

            process.exit(0);
        });
    } else {
        await closeDatabase();

        process.exit(0);
    }
};

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    shutdown("SIGINT");
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);

    if (server) {
        server.close(async () => {
            await closeDatabase();

            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);

    process.exit(1);
});

startServer();