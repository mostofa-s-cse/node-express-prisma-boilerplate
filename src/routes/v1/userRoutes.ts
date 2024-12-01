import { Router } from "express";
import * as userController from "../../ controllers/v1/userController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { upload } from "../../utils/fileUpload";

const userRouter = Router();

// User management routes
userRouter.get("/", isAuthenticated, userController.getAllUsers);         // Get all users
userRouter.put(
    "/:id",
    isAuthenticated,            // Middleware to ensure authentication
    upload.single("profileImage"), // Handle file uploads with the key `profileImage`
    userController.updateUser     // Controller to handle update logic
);
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);    // Delete user

export default userRouter;
