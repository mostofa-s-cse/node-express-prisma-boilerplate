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

        accessToken = response.body.data.accessToken;
    });

    // Create Permission Tests
    describe("POST /api/v1/permissions", () => {
        it("should create a new permission successfully", async () => {
            const response = await request(app)
                .post("/api/v1/permissions")
                .send({
                    name: "create-teamss", // Ensure the name is as expected
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "create-teams");
            createdPermissionId = response.body.data.id; // Ensure this ID is stored
        });

        it("should fail to create a permission with an existing name", async () => {
            const response = await request(app)
                .post("/api/v1/permissions")
                .send({
                    name: "create-teamss", // Trying to create the same permission again
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
                    name: "update-teams", // Updated permission name
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "update-teams");
        });

        it("should fail to update a non-existing permission", async () => {
            const response = await request(app)
                .put(`/api/v1/permissions/000`)
                .send({
                    name: "nonexistent-permission",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Permission not found");
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
                .delete(`/api/v1/permissions/nonexistent`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Permission not found");
        });
    });
});
