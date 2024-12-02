import { Request, Response, NextFunction } from "express";
import prisma from "../config/database"; // Adjust path if necessary
import { AppError } from "./errorHandler";

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId; // Assume `isAuthenticated` middleware sets this

            if (!userId) {
                return next(new AppError("Unauthorized: User not authenticated", 401));
            }

            // Fetch user's roles
            const userRoles = await prisma.userRole.findMany({
                where: { userId },
                select: { roleId: true },
            });

            if (!userRoles.length) {
                return next(new AppError("Forbidden: User has no roles assigned", 403));
            }

            const roleIds = userRoles.map((role) => role.roleId);

            // Fetch permissions for the roles
            const rolePermissions = await prisma.rolePermission.findMany({
                where: { roleId: { in: roleIds } },
                include: { permission: true }, // Include the related permissions
            });

            const userPermissions = rolePermissions.map((rp) => rp.permission.name);

            // Check if user has the required permission
            if (!userPermissions.includes(requiredPermission)) {
                return next(new AppError("Forbidden: Insufficient permissions", 403));
            }

            next(); // Permission check passed, continue to next middleware/controller
        } catch (error) {
            console.error("Error in checkPermission middleware:", error);
            return next(new AppError("Internal Server Error: Permission check failed", 500));
        }
    };
};
