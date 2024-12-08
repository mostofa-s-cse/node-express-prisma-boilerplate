import { Request, Response, NextFunction } from "express";
import prisma from "../config/database"; // Adjust the path if necessary
import { AppError } from "./errorHandler"; // Import your custom error handling class

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId; // Assuming `isAuthenticated` middleware attaches this to the request

            if (!userId) {
                return next(new AppError("Unauthorized: User not authenticated", 401));
            }

            // Fetch the user's roles
            const userRoles = await prisma.userRole.findMany({
                where: { userId },
                select: { roleId: true },
            });

            if (!userRoles.length) {
                return next(new AppError("Forbidden: User has no roles assigned", 403));
            }

            const roleIds = userRoles.map((role) => role.roleId);

            // Fetch permissions for the user's roles
            const rolePermissions = await prisma.rolePermission.findMany({
                where: { roleId: { in: roleIds } },
                include: { permission: true }, // Including the related permissions
            });

            // Extract the permissions the user has
            const userPermissions = rolePermissions.map((rp) => rp.permission.name);

            // Check if the user has the required permission
            if (!userPermissions.includes(requiredPermission)) {
                return next(new AppError("Forbidden: Insufficient permissions", 403));
            }

            next(); // Permission check passed, proceed to the next middleware or controller
        } catch (error) {
            console.error("Error in checkPermission middleware:", error);
            return next(new AppError("Internal Server Error: Permission check failed", 500));
        }
    };
};
