import { AppError } from "../../middlewares/errorHandler";
import prisma from "../../config/database";
import {validateEmail} from "../../utils/emailValidation";
import bcrypt from "bcrypt"; // Custom error handling

/**
 * Create new user
 * @param name
 * @param email
 * @param password
 */
export const createUser = async (name: string, email: string, password: string) => {
    // Validate email format before processing
    validateEmail(email);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database with hashed password
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return user;
};

/**
 * View the users
 */
export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return users;
};

/**
 * Update the user profile.
 * @param id User ID to update.
 * @param data Object containing fields to update (name, email, image).
 * @returns Updated user data.
 */
export const updateUser = async (id: string, data: { name?: string; email?: string; profileImage?: string }) => {
    // Validate email format if email is provided
    if (data.email) {
        validateEmail(data.email);
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new AppError("User not found", 404);
    }

    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

/**
 * Delete User
 * @param id
 */
export const deleteUser = async (id: string) => {
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new AppError("User not found", 404);
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });
};
