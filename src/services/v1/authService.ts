// src/services/userService.ts

import { AppError } from "../../middlewares/errorHandler";
import prisma from "../../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/email";
import { validateEmail } from "../../utils/emailValidation"; // Import validateEmail function
import { generateOtp, generateOtpExpiry } from "../../utils/generateOtp"; // Import OTP utility functions

/**
 * Register a new user.
 * - Hashes the password.
 * - Saves the user to the database.
 * - Sends an OTP for email verification.
 */
export const registerUser = async (email: string, password: string, name: string) => {
    // Validate email format before processing
    validateEmail(email);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
    });

    const otp = generateOtp(); // Generate OTP using utility
    await sendEmail(email, "Verify Your Email", name, otp); // Send OTP email
    await prisma.user.update({ where: { id: user["id"] }, data: { otp } });

    return { message: "User registered successfully. Please verify your email." };
};

/**
 * Verify the user's email using OTP.
 * - Checks if the OTP matches.
 * - Marks the email as verified.
 */
export const verifyOtp = async (email: string, otp: string) => {
    // Validate email format before processing
    validateEmail(email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user["otp"] !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    await prisma.user.update({
        where: { email },
        data: { emailVerified: true, otp: null },
    });

    return { message: "Email verified successfully." };
};

/**
 * Resend OTP for email verification.
 * - Generates a new OTP and sends it via email.
 */
export const resendOtp = async (email: string) => {
    // Validate email format before processing
    validateEmail(email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user["emailVerified"]) {
        throw new AppError("Email is already verified", 400);
    }

    if (!user["name"]) {
        throw new AppError("User name is missing", 400);
    }

    const otp = generateOtp(); // Generate new OTP using utility
    await sendEmail(email, "Verify Your Email", user["name"], otp);

    await prisma.user.update({ where: { email }, data: { otp } });

    return { message: "OTP sent successfully. Please check your email." };
};

/**
 * Login a user.
 * - Verifies credentials.
 * - Generates access and refresh tokens.
 */
export const loginUser = async (email: string, password: string) => {
    // Validate email format before processing
    validateEmail(email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    if (!user["emailVerified"]) {
        throw new AppError("Email not verified", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user["password"]);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwt.sign({ id: user["id"] }, process.env.JWT_SECRET!, { expiresIn: "60m" });
    const refreshToken = jwt.sign({ id: user["id"] }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    await prisma.user.update({ where: { id: user["id"] }, data: { refreshToken } });

    return { user, accessToken, refreshToken };
};

/**
 * Refresh the access token.
 * - Verifies the refresh token.
 * - Generates a new access token and refresh token if valid.
 * - Returns the new tokens.
 */
export const refreshTokens = async (refreshToken: string) => {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const userId = decoded.id;

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user["refreshToken"] !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
    }

    // Generate new access and refresh tokens
    const accessToken = jwt.sign({ id: user["id"] }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: user["id"] }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    // Update the refresh token in the database
    await prisma.user.update({
        where: { id: user["id"] },
        data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
};

/**
 * Request a password reset.
 * @param email The user's email address.
 */
export const requestPasswordReset = async (email: string) => {
    // Validate email format before processing
    validateEmail(email);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Generate a reset OTP (6 digits)
    const otp = generateOtp(); // Generate OTP using utility

    // Set OTP expiry time to 3 minutes from now
    const otpExpiry = generateOtpExpiry(); // Generate OTP expiry using utility

    // Save the OTP and its expiry to the user's record
    await prisma.user.update({
        where: { email },
        data: {
            passwordResetToken: otp, // Store OTP as the reset token
            passwordResetTokenExpires: otpExpiry,
        },
    });

    // Send the OTP via email
    const emailMessage = `You requested a password reset. Use the following OTP to reset your password: ${otp}. It will expire in 3 minutes.`;
    await sendEmail(email, "Password Reset OTP", user["name"] || "User", emailMessage);

    return "Password reset OTP has been sent to your email. Please check your inbox.";
};

/**
 * Reset the password using an OTP.
 * @param email The user's email address.
 * @param otp The OTP sent to the user's email.
 * @param newPassword The new password to set.
 */
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Check if the OTP matches
    if (user["passwordResetToken"] !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    // Check if OTP has expired (handle case where passwordResetTokenExpires might be null)
    if (!user["passwordResetTokenExpires"] || user["passwordResetTokenExpires"] < new Date()) {
        throw new AppError("OTP has expired", 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the OTP fields
    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            passwordResetToken: null, // Clear OTP after successful reset
            passwordResetTokenExpires: null, // Clear OTP expiry
        },
    });

    return "Your password has been reset successfully.";
};

/**
 * Fetch the authenticated user's details.
 * - Verifies the user ID from the token.
 * - Returns user data without sensitive fields like password.
 */
export const getAuthUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};
