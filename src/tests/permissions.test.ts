const request = require("supertest");
import app from "../app";

describe("Permissions API Tests", () => {
    let accessToken: string;
    let createdPermissionId: string;

    // Login to get an access token for authenticated routes
    beforeAll(async () => {
        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "superadmin@example.com",
                password: "password123",
            });

        expect(response.status).toBe(200);
        accessToken = response.body.data.accessToken;
    });

    // Create Permission Tests
    describe("POST /api/v1/permissions", () => {
        it("should create a new permission successfully", async () => {
            const response = await request(app)
                .post("/api/v1/permissions")
                .send({
                    name: "manage-teams",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "manage-teams");
            createdPermissionId = response.body.data.id;
        });

        it("should fail to create a permission with an existing name", async () => {
            const response = await request(app)
                .post("/api/v1/permissions")
                .send({
                    name: "manage-teams",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Permission already exists");
        });
    });

    // Get All Permissions Tests
    describe("GET /api/v1/permissions", () => {
        it("should retrieve all permissions successfully", async () => {
            const response = await request(app)
                .get("/api/v1/permissions")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    // Update Permission Tests
    describe("PUT /api/v1/permissions/:id", () => {
        it("should update an existing permission successfully", async () => {
            const response = await request(app)
                .put(`/api/v1/permissions/${createdPermissionId}`)
                .send({
                    name: "manage-projects",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "manage-projects");
        });

        it("should fail to update a non-existing permission", async () => {
            const response = await request(app)
                .put(`/api/v1/permissions/nonexistent-id`)
                .send({
                    name: "nonexistent-permission",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Permission not found");
        });
    });

   
    // Assign Permission to Role Tests
    describe("POST /api/v1/permissions/assign-permission", () => {
        let testRoleId: string;
        let createdPermissionId: string;
    
        beforeAll(async () => {
            const roleResponse = await request(app)
                .post("/api/v1/roles")
                .send({ name: `TestRole_${Date.now()}` })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(roleResponse.status).toBe(201);
            testRoleId = roleResponse.body.data.id;
    
            const permissionResponse = await request(app)
                .post("/api/v1/permissions")
                .send({ name: `TestPermission_${Date.now()}` })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(permissionResponse.status).toBe(201);
            createdPermissionId = permissionResponse.body.data.id;
        });
    
        afterAll(async () => {
            await request(app)
                .delete(`/api/v1/roles/${testRoleId}`)
                .set("Authorization", `Bearer ${accessToken}`);
    
            await request(app)
                .delete(`/api/v1/permissions/${createdPermissionId}`)
                .set("Authorization", `Bearer ${accessToken}`);
        });
    
        it("should assign a permission to a role successfully", async () => {
            const response = await request(app)
                .post("/api/v1/permissions/assign-permission")
                .send({
                    roleId: testRoleId,
                    permissionId: createdPermissionId,
                })
                .set("Authorization", `Bearer ${accessToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty(
                "message",
                "Permission assigned successfully"
            );
        });
    
        it("should fail to assign a permission to a non-existing role", async () => {
            const response = await request(app)
                .post("/api/v1/permissions/assign-permission")
                .send({
                    roleId: "nonexistent-role-id",
                    permissionId: createdPermissionId,
                })
                .set("Authorization", `Bearer ${accessToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Role not found");
        });
    
        it("should fail to assign a non-existing permission to a role", async () => {
            const response = await request(app)
                .post("/api/v1/permissions/assign-permission")
                .send({
                    roleId: testRoleId,
                    permissionId: "nonexistent-permission-id",
                })
                .set("Authorization", `Bearer ${accessToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Permission not found");
        });
    
        it("should fail to assign the same permission to a role twice", async () => {
            const response = await request(app)
                .post("/api/v1/permissions/assign-permission")
                .send({
                    roleId: testRoleId,
                    permissionId: createdPermissionId,
                })
                .set("Authorization", `Bearer ${accessToken}`);
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Role already has this permission"
            );
        });
    });
    
     // Delete Permission Tests
     describe("DELETE /api/v1/permissions/:id", () => {
        it("should delete an existing permission successfully", async () => {
            const response = await request(app)
                .delete(`/api/v1/permissions/${createdPermissionId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("message", "Permission deleted successfully");
        });

        it("should fail to delete a non-existing permission", async () => {
            const response = await request(app)
                .delete(`/api/v1/permissions/nonexistent-id`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Permission not found");
        });
    });

});
