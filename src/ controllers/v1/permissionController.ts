import { Request, Response, NextFunction } from "express";
import * as permissionService from "../../services/v1/permissionService"; // Import permission service

// Create permission
export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const permission = await permissionService.createPermission(name);
        res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Get all permissions
export const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        res.status(200).json({
            success: true,
            message: "Permissions retrieved successfully",
            data: permissions,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Assign permission to a role
export const assignPermissionToRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roleId, permissionId } = req.body;

        const response = await permissionService.assignPermissionToRole(roleId, permissionId);

        res.status(200).json({
            success: true,
            message: response.message,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Update permission
export const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedPermission = await permissionService.updatePermission(id, name);

        res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: updatedPermission,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Delete permission
export const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const response = await permissionService.deletePermission(id);

        res.status(200).json({
            success: true,
            message: response.message,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};
