import { Router } from "express";
import * as userController from "../../ controllers/v1/userController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { upload } from "../../utils/fileUpload";
import {checkPermission} from "../../middlewares/checkPermission";

const userRouter = Router();

// User management routes

userRouter.post("/", isAuthenticated, checkPermission("create-users"),userController.createUser);
userRouter.get("/", isAuthenticated, checkPermission("view-users"),userController.getAllUsers);         // Get all users
userRouter.put(
    "/:id",
    isAuthenticated,            // Middleware to ensure authentication
    upload.single("profileImage"), // Handle file uploads with the key `profileImage`
    checkPermission("update-users"),
    userController.updateUser     // Controller to handle update logic
);
userRouter.delete("/:id", isAuthenticated,checkPermission("delete-users"),userController.deleteUser);    // Delete user

export default userRouter;
