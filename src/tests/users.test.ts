const request = require("supertest");
import app from "../app";

describe("Users API Tests", () => {
    let accessToken: string;
    let createdUserId: string;

    // Login to get an access token for authenticated routes
    describe("POST /login", () => {
        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "superadmin@example.com",
                    password: "password123",
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("accessToken");
            accessToken = response.body.data.accessToken;
        });
    });

    // Create a new user
    describe("POST /api/v1/users", () => {
        it("should create a user", async () => {
            const response = await request(app)
                .post("/api/v1/users")
                .send({
                    email: "newuser@example.com",
                    password: "Password123!",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("id");
            createdUserId = response.body.data.id; // Store created user's ID for update and delete tests
        });

        it("should fail to create a user with an existing email", async () => {
            const response = await request(app)
                .post("/api/v1/users")
                .send({
                    email: "newuser@example.com",
                    password: "Password123!",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "User already exists");
        });
    });

    // Retrieve all users
    describe("GET /api/v1/users", () => {
        it("should retrieve all users", async () => {
            const response = await request(app)
                .get("/api/v1/users")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    // Update a user
    describe("PUT /api/v1/users/:id", () => {
        it("should update the user's email", async () => {
            const response = await request(app)
                .put(`/api/v1/users/${createdUserId}`)
                .send({
                    email: "updateduser@example.com",
                })
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("email", "updateduser@example.com");
        });

        describe("PUT /api/v1/users/:id", () => {
            it("should fail to update with an invalid ID", async () => {
                const response = await request(app)
                    .put("/api/v1/users/000")
                    .send({
                        email: "invaliduser@example.com",
                    })
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty("message", "User not found");
            });
        });
    });

    // Delete a user
    describe("DELETE /api/v1/users/:id", () => {
        it("should delete the user", async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${createdUserId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "User deleted successfully");
        });

        describe("DELETE /api/v1/users/:id", () => {
            it("should fail to delete with an invalid ID", async () => {
                const response = await request(app)
                    .delete("/api/v1/users/0000")
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty("message", "User not found");
            });
        });
    });
});
