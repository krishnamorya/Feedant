import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

/**
 * Generic Zod validation middleware factory.
 * Validates req.body (or req.query for GET) against the provided schema.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ("body" | "query" | "params")
 */
export const validate = (
    schema: ZodSchema,
    source: "body" | "query" | "params" = "body"
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[source]);
            // Replace with parsed (coerced/defaulted) values
            (req as Record<string, unknown>)[source] = parsed;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => {
                    const path = err.path.join(".");
                    return path ? `${path}: ${err.message}` : err.message;
                });

                throw new ApiError(400, "Validation failed", errorMessages);
            }
            next(error);
        }
    };
};
