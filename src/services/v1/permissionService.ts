import prisma from "../../config/database";
import { AppError } from "../../middlewares/errorHandler";  // Custom error handler

// Create a new permission
export const createPermission = async (name: string) => {
    const existingPermission = await prisma.permission.findUnique({ where: { name } });
    if (existingPermission) {
        throw new AppError("Permission already exists", 400);
    }

    const permission = await prisma.permission.create({
        data: {
            name,
        },
    });

    return permission;
};

// Get all permissions
export const getAllPermissions = async () => {
    return await prisma.permission.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Assign permission to a role
export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
        throw new AppError("Role not found", 404);
    }

    const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) {
        throw new AppError("Permission not found", 404);
    }

    const existingRolePermission = await prisma.rolePermission.findUnique({
        where: { roleId_permissionId: { roleId, permissionId } },
    });

    if (existingRolePermission) {
        throw new AppError("Role already has this permission", 400);
    }

    await prisma.rolePermission.create({
        data: {
            roleId,
            permissionId,
        },
    });

    return { message: "Permission assigned successfully" };
};

// Update permission
export const updatePermission = async (id: string, name: string) => {
    const existingPermission = await prisma.permission.findUnique({ where: { id } });
    if (!existingPermission) {
        throw new AppError("Permission not found", 404);
    }

    const updatedPermission = await prisma.permission.update({
        where: { id },
        data: { name },
    });

    return updatedPermission;
};

// Delete permission
export const deletePermission = async (id: string) => {
    const existingPermission = await prisma.permission.findUnique({ where: { id } });
    if (!existingPermission) {
        throw new AppError("Permission not found", 404);
    }

    // Check if any roles are using this permission
    const rolePermissions = await prisma.rolePermission.count({
        where: { permissionId: id },
    });

    if (rolePermissions > 0) {
        throw new AppError("Cannot delete permission, it is assigned to one or more roles", 400);
    }

    await prisma.permission.delete({ where: { id } });

    return { message: "Permission deleted successfully" };
};
