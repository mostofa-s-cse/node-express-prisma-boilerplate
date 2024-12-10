import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/v1/authService";
import { AppError } from "../../middlewares/errorHandler";

/**
 * Registers a new user.
 * - Accepts `email`, `password`, and `name` in the request body.
 * - Calls the authService to create a new user and sends an OTP to the user's email.
 * - Returns a success message upon successful registration.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.registerUser(email, password, name);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verifies the OTP sent to the user's email during registration.
 * - Accepts `email` and `otp` in the request body.
 * - Verifies the OTP and updates the user's email verification status.
 * - Returns a success message if the OTP is valid.
 */
export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtp(email, otp);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Resends a One-Time Password (OTP) to the user's email.
 * - Accepts `email` in the request body.
 * - Calls the authService to generate and send a new OTP to the provided email.
 * - Returns a success message if the OTP is successfully sent.
 * - Passes any encountered errors to the error-handling middleware.
 */
export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await authService.resendOtp(email);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logs in the user.
 * - Accepts `email` and `password` in the request body.
 * - Authenticates the user, generates an access token and refresh token.
 * - Returns the tokens if authentication is successful.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful. Welcome back!",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh the access token using the refresh token.
 * - Verifies the refresh token and generates new access and refresh tokens.
 * - Returns the new tokens if successful.
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError("Refresh token is required", 400));
    }

    try {
        const result = await authService.refreshTokens(refreshToken);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Requests a password reset.
 * - Accepts `email` in the request body.
 * - Calls the authService to generate a reset token and sends it to the user's email.
 * - Returns a success message upon successful request.
 */
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Call the service to handle the password reset request
        const result = await authService.requestPasswordReset(email);

        res.status(200).json({
            success: true,
            message: result, // result is the success message returned from service
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};

/**
 * Resets the password using the provided OTP.
 * - Accepts `email`, `otp`, and `newPassword` in the request body.
 * - Calls the authService to reset the user's password.
 * - Returns a success message upon successful reset.
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Call the service to handle the password reset
        const result = await authService.resetPassword(email, otp, newPassword);

        res.status(200).json({
            success: true,
            message: result, // result is the success message returned from service
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};


import * as userService from "../../services/v1/userService";

/**
 * Get the authenticated user's details.
 * - Requires the `userId` extracted from the token middleware.
 */
export const getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.user?.id);
        if (isNaN(userId)) {
            throw new AppError("Invalid user ID", 400);
        }

        const user = await authService.getAuthUser(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
