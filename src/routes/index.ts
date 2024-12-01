import { Router } from "express";
import authRoutes from "./v1/authRoutes";
import userRoutes from "./v1/userRoutes";
import roleRouter from "./v1/roleRoutes";
import permissionRouter from "./v1/permissionRoutes";

const router = Router();

// Version 1 routes
// Combine all routes
router.use("/auth", authRoutes); // Routes for authentication
router.use("/users", userRoutes); // Routes for user management
router.use("/roles", roleRouter); // Routes for Role management
router.use("/permissions", permissionRouter); // Routes for Permission management


// Version 2 routes

export default router;
