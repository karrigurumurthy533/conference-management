const mongoose = require("mongoose");
const { getIO } = require("./socket");

let notificationChangeStream;

const startNotificationChangeStream = () => {
    try {
        const notificationsCollection =
            mongoose.connection.collection("notifications");

        notificationChangeStream =
            notificationsCollection.watch();

        notificationChangeStream.on("change", (change) => {
            console.log(
                "Notification change:",
                change.operationType
            );

            if (change.operationType !== "insert") {
                return;
            }

            const notification =
                change.fullDocument;

            console.log(
                "New notification:",
                notification
            );

            getIO().emit(
                "newNotification",
                notification
            );
        });

        notificationChangeStream.on("error", (error) => {
            console.error(
                "Notification Change Stream Error:",
                error
            );
        });

        console.log(
            "Notification Change Stream started"
        );
    } catch (error) {
        console.error(
            "Failed to start Notification Change Stream:",
            error
        );
    }
};

const closeNotificationChangeStream = async () => {
    if (notificationChangeStream) {
        await notificationChangeStream.close();

        notificationChangeStream = null;

        console.log(
            "Notification Change Stream closed"
        );
    }
};

module.exports = {
    startNotificationChangeStream,
    closeNotificationChangeStream,
};