import mongoose from "mongoose";

/**
 * Connect to MongoDB with retry logic.
 * Call this before starting the Express server.
 */
export const connectDB = async (): Promise<void> => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }

    // Handle connection events
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });
};

/**
 * Gracefully close the MongoDB connection.
 */
export const disconnectDB = async (): Promise<void> => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
};

// Graceful shutdown on process signals
process.on("SIGINT", async () => {
    await disconnectDB();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await disconnectDB();
    process.exit(0);
});
