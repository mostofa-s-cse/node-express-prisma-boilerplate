import prisma from "../../config/database";
import { AppError } from "../../middlewares/errorHandler";  // Custom error handler

// Create a new role
export const createRole = async (name: string) => {
    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
        throw new AppError("Role already exists", 400);
    }

    const role = await prisma.role.create({
        data: {
            name,
        },
    });

    return role;
};

// Get all roles
export const getAllRoles = async () => {
    return await prisma.role.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Update a role
export const updateRole = async (id: string, data: { name: string }) => {
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
        throw new AppError("Role not found", 404);
    }

    const updatedRole = await prisma.role.update({
        where: { id },
        data,
    });

    return updatedRole;
};

// Delete a role
export const deleteRole = async (id: string) => {
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
        throw new AppError("Role not found", 404);
    }

    await prisma.role.delete({ where: { id } });
};
