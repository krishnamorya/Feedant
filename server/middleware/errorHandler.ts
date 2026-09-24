import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Default values
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: string[] = [];

    // ─── Handle known error types ───────────────────────────────

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }

    // Mongoose validation errors
    else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors).map((e) => e.message);
    }

    // Mongoose cast errors (invalid ObjectId, etc.)
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // MongoDB duplicate key error (code 11000)
    else if (
        (err as Record<string, unknown>).code === 11000 ||
        err.name === "MongoServerError"
    ) {
        const mongoErr = err as Record<string, unknown>;
        if (mongoErr.code === 11000) {
            statusCode = 409;
            const keyValue = mongoErr.keyValue as Record<string, unknown>;
            const field = Object.keys(keyValue || {}).join(", ");
            message = `Duplicate value for: ${field}. This record already exists.`;
        }
    }

    // ─── Log in development ─────────────────────────────────────

    if (process.env.NODE_ENV !== "production") {
        console.error("─── Error ───────────────────────────────");
        console.error("Status:", statusCode);
        console.error("Message:", message);
        if (errors.length) console.error("Errors:", errors);
        console.error("Stack:", err.stack);
        console.error("─────────────────────────────────────────");
    }

    // ─── Send response ──────────────────────────────────────────

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};
