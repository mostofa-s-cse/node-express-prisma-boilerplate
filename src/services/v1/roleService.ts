import prisma from "../../config/database";
import { AppError } from "../../middlewares/errorHandler";  // Custom error handler

// Create a new role
export const createRole = async (name: string) => {
    const existingRole = await prisma.role.findUnique({ where: { name } });
    // Check if the role already exists
    if (existingRole) {
        throw new AppError("Role already exists", 400);
    }
    // Check if the role name is provided
    if (name === "") {
        throw new AppError("Role name is required", 400);
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
    return prisma.role.findMany({
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
    // Check if the role exists
    if (!existingRole) {
        throw new AppError("Role not found", 404);
    }
    // Check if the role name is provided
    if (data.name === "") {
        throw new AppError("Role name is required", 400);
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


// Assign a role to a user
export const assignRoleToUser = async (userId: number, roleId: string) => {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    // Check if the user ID is provided
    if (!userId){
        throw new AppError("User ID is required", 400);
    }
    // Check if the role ID is provided
    if (!roleId){
        throw new AppError("Role ID is required", 400);
    }
    // Check if the role exists
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
        throw new AppError("Role not found", 404);
    }

    // Check if the user already has the role
    const existingUserRole = await prisma.userRole.findUnique({
        where: { userId_roleId: { userId, roleId } },
    });

    if (existingUserRole) {
        throw new AppError("User already assigned to this role", 400);
    }

    // Assign the role to the user
    const userRole = await prisma.userRole.create({
        data: {
            userId,
            roleId,
        },
    });

    return userRole;
};

// Get all roles assigned to a user
export const getUserRoles = async (userId: number) => {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Fetch and return the roles
    const roles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }, // Include role details
    });

    return roles.map((userRole) => userRole["role"]);
};