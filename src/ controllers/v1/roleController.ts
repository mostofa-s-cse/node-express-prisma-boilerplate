import { Request, Response, NextFunction } from "express";
import * as roleService from "../../services/v1/roleService"; // Import role service

// Create role
export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const role = await roleService.createRole(name);
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Get all roles
export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json({
            success: true,
            message: "Roles retrieved successfully",
            data: roles,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Update role
export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedRole = await roleService.updateRole(id, { name });

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedRole,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Delete role
export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await roleService.deleteRole(id);

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};
