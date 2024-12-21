const request = require("supertest");
import app from "../app";

describe("Roles API Tests", () => {
    let accessToken: string;
    let createdRoleId: string;

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

    // Create Role Tests
    describe("POST /api/v1/roles", () => {
        it("should create a new role successfully", async () => {
            const response = await request(app)
                .post("/api/v1/roles")
                .send({
                    name: "Manager",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "Manager");
            createdRoleId = response.body.data.id;
        });

        it("should fail to create a role with an existing name", async () => {
            const response = await request(app)
                .post("/api/v1/roles")
                .send({
                    name: "Manager",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Role already exists");
        });
    });

    // Get Roles Tests
    describe("GET /api/v1/roles", () => {
        it("should retrieve all roles successfully", async () => {
            const response = await request(app)
                .get("/api/v1/roles")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    // Update Role Tests
    describe("PUT /api/v1/roles/:id", () => {
        it("should update an existing role successfully", async () => {
            const response = await request(app)
                .put(`/api/v1/roles/${createdRoleId}`)
                .send({
                    name: "UpdatedManager",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("name", "UpdatedManager");
        });

        it("should fail to update a non-existing role", async () => {
            const response = await request(app)
                .put(`/api/v1/roles/000`)
                .send({
                    name: "NonexistentRole",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Role not found");
        });
    });

    // Delete Role Tests
    describe("DELETE /api/v1/roles/:id", () => {
        it("should delete an existing role successfully", async () => {
            const response = await request(app)
                .delete(`/api/v1/roles/${createdRoleId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("message", "Role deleted successfully");
        });

        it("should fail to delete a non-existing role", async () => {
            const response = await request(app)
                .delete(`/api/v1/roles/nonexistent`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Role not found");
        });
    });
});
