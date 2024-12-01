import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import {AppError} from "./errorHandler";

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId;  // User ID from the JWT token (attached by `isAuthenticated`)

            // Fetch roles associated with the user
            const userRoles = await prisma.userRole.findMany({
                where: { userId: userId },
                select: { roleId: true },
            });

            if (userRoles.length === 0) {
                return next(new AppError("User has no roles", 403)); // User has no assigned roles
            }

            const roleIds = userRoles.map((userRole) => userRole.roleId);

            // Fetch permissions associated with the user's roles
            const permissions = await prisma.rolePermission.findMany({
                where: { roleId: { in: roleIds } },
                select: { permission: { select: { name: true } } },
            });

            const userPermissions = permissions.map((rolePermission) => rolePermission.permission.name);

            // Check if the user has the required permission
            if (!userPermissions.includes(requiredPermission)) {
                return next(new AppError("Forbidden: Insufficient permissions", 403)); // User doesn't have permission
            }

            next(); // User has permission, proceed to the next handler
        } catch (error) {
            return next(new AppError("Forbidden: Error while checking permissions", 403)); // Handle permission checking error
        }
    };
};
