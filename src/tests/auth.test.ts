import bcrypt from "bcrypt";
const request = require("supertest");
import app from "../app";
import prisma from "../config/database";

describe("Auth API Tests", () => {
    let accessToken: string; // Ensure a semicolon here if you are using a semicolon-based style

    beforeAll(async () => {
        await prisma.user.create({
            data: {
                name: "Test User",
                email: "testuser@gmail.com",
                password: bcrypt.hashSync("password123", 10), // Hash the password
                otp: "123456", // Add OTP for verification test
            },
        });
    });
    
    afterAll(async () => {
        await prisma.$disconnect();
    });    

    describe("POST /register", () => {
        it("should register a new user successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    email: "newtestuser@example.com",
                    password: "Password123!"
                });
            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("message", "User registered successfully. Please verify your email.");
        });

        it("should fail if email is already registered", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    email: "testuser@gmail.com",
                    password: "password123"
                });
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message", "User already exists");
        });
    });


    describe("POST api/v1/auth/verify", () => {
        it("should verify user with valid OTP", async () => {
            const response = await request(app)
                .post("/api/v1/auth/verify")
                .send({
                    email: "testuser@gmail.com",
                    otp: "123456", // Ensure this matches the seeded data
                });

            expect(response.body.data).toHaveProperty("message", "Email verified successfully.");
        });
    });

    describe("POST /login", () => {
        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "testuser@gmail.com",
                    password: "password123", // Use the same password that was hashed during registration
                });
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("accessToken"); // Assuming you return accessToken on successful login
            accessToken = response.body.data.accessToken; // Store accessToken for subsequent requests
        });
    });

    describe("GET /api/v1/auth/me", () => {
        it("should retrieve authenticated user info", async () => {
            // Ensure `accessToken` has been set
            if (!accessToken) throw new Error("Access token not set. Login test might have failed.");

            const response = await request(app)
                .get("/api/v1/auth/me")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("email", "testuser@gmail.com");
        });
    });
});