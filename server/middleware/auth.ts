import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Extend Express Request to include user info from JWT.
 */
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}

/**
 * JWT Authentication middleware (placeholder).
 *
 * In production, this would verify a JWT token from the Authorization header.
 * For now, it reads userId and userRole from custom headers for development.
 */
export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    // Development mode: accept userId from header
    const userId = req.headers["x-user-id"] as string;
    const userRole = (req.headers["x-user-role"] as string) || "user";

    if (!userId) {
        throw new ApiError(401, "Authentication required. Please provide x-user-id header.");
    }

    req.userId = userId;
    req.userRole = userRole;
    next();
};

/**
 * Authorization middleware — restricts access to specific roles.
 *
 * @param roles - Allowed roles (e.g., "admin", "judge")
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            throw new ApiError(
                403,
                `Access denied. Required role(s): ${roles.join(", ")}`
            );
        }
        next();
    };
};

/**
 * Optional authentication — attaches user info if present, but doesn't block.
 * Useful for public endpoints that show extra data for logged-in users.
 */
export const optionalAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const userId = req.headers["x-user-id"] as string;
    const userRole = (req.headers["x-user-role"] as string) || "user";

    if (userId) {
        req.userId = userId;
        req.userRole = userRole;
    }

    next();
};
