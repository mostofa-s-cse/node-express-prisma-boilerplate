import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler"; // Import your AppError class

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || typeof authHeader !== "string") {
            // If authorization header is missing or not a string, return an error
            return next(new AppError("No token provided", 401));
        }

        const token = authHeader.split(" ")[1]; // Extract the token from Authorization header

        if (!token) {
            return next(new AppError("No token provided", 401)); // Handle case where token is missing
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).userId = (decoded as any).id;  // Attach user ID to the request

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Pass the error to the error handler middleware
        next(new AppError("Unauthorized", 401));  // Handle JWT verification failure
    }
};
