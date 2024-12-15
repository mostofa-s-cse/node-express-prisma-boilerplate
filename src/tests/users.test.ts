import prisma from "../config/database";

const request = require("supertest");
import app from "../app";
import bcrypt from "bcrypt";

describe("User Role & Permission Assignment Tests", () => {
    let adminAccessToken: string;
    let editorAccessToken: string;
    let userId: string;
    let adminRoleId: string;
    let editorRoleId: string;
    let manageRolesPermissionId: string;

    beforeAll(async () => {
        // Create the admin user
        const adminResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "superadmin@example.com",
                password: "password123",
            });

        expect(adminResponse.status).toBe(200);
        adminAccessToken = adminResponse.body.data.accessToken;

        // Create an editor user for testing the role assignment
        const editorResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                email: "editoruser@example.com",
                password: "Password123!",
            });

        expect(editorResponse.status).toBe(201);
        const editorUser = editorResponse.body.data;
        editorAccessToken = editorUser.accessToken; // Get editor's access token
        userId = editorUser.id; // Save editor's user ID

        // Retrieve roles and permissions
        const roles = await prisma.role.findMany();
        adminRoleId = roles.find(role => role.name === "Admin").id;
        editorRoleId = roles.find(role => role.name === "Editor").id;

        const permissions = await prisma.permission.findMany();
        manageRolesPermissionId = permissions.find(permission => permission.name === "manage-roles").id;

        // Assign roles to users
        await prisma.userRole.create({
            data: {
                userId: editorUser.id,
                roleId: editorRoleId,
            },
        });
        await prisma.userRole.create({
            data: {
                userId: adminResponse.body.data.id,
                roleId: adminRoleId,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("Assign Roles and Permissions", () => {
        it("should assign roles to users", async () => {
            const response = await request(app)
                .post("/api/v1/roles/assign")
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .send({
                    userId,
                    roleId: editorRoleId,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Role assigned successfully");
        });

        it("should assign permissions to the admin role", async () => {
            const response = await request(app)
                .post("/api/v1/permissions/assign")
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .send({
                    roleId: adminRoleId,
                    permissionId: manageRolesPermissionId,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Permission assigned successfully");
        });
    });

    describe("User Edit and Delete Tests", () => {
        it("should allow the admin to edit a user", async () => {
            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .send({
                    name: "Updated Editor User",
                    email: "updatededitoruser@example.com",
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("email", "updatededitoruser@example.com");
            expect(response.body.data).toHaveProperty("name", "Updated Editor User");
        });

        it("should not allow the editor to edit a user", async () => {
            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .set("Authorization", `Bearer ${editorAccessToken}`)
                .send({
                    name: "Failed Update User",
                    email: "failedupdate@example.com",
                });

            expect(response.status).toBe(403); // Forbidden, as the editor doesn't have permission to edit
            expect(response.body).toHaveProperty("message", "You do not have permission to perform this action");
        });

        it("should allow the admin to delete a user", async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${userId}`)
                .set("Authorization", `Bearer ${adminAccessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "User deleted successfully.");
        });

        it("should not allow the editor to delete a user", async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${userId}`)
                .set("Authorization", `Bearer ${editorAccessToken}`);

            expect(response.status).toBe(403); // Forbidden, as the editor doesn't have permission to delete
            expect(response.body).toHaveProperty("message", "You do not have permission to perform this action");
        });
    });
});
