import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/v1/userService"; // Import the service layer

/**
 * Create user
 * @param req
 * @param res
 * @param next
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.createUser(name, email, password);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}


/**
 * View All users
 * @param req
 * @param res
 * @param next
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    console.log("req",req);
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 * @param req
 * @param res
 * @param next
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        // Handle optional profile image upload
        let profileImage: string | undefined = undefined; // Initialize as undefined
        if (req.file) {
            profileImage = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await userService.updateUser(id, { name, email, profileImage });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Delete user
 * @param req
 * @param res
 * @param next
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await userService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
