import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler"; // Import your AppError class

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided or invalid format", 401);
        }

        const token = authHeader.split(" ")[1]; // Extract the token

        if (!token) {
            throw new AppError("No token provided", 401); // Handle case where token is empty
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        if (!decoded || !decoded.id) {
            throw new AppError("Invalid token payload", 401);
        }

        req.user = { id: decoded.id }; // Attach user ID to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Check for JWT-specific errors
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
        }
        // Generic error
        next(error);
    }
};
