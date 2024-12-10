import { Router } from "express";
import * as authController from "../../ controllers/v1/authController";
import {isAuthenticated} from "../../middlewares/isAuthenticated";

const authRouter = Router();

// Authentication routes
authRouter.post("/register", authController.register);      // Register
authRouter.post("/verify", authController.verify);          // Verify OTP
authRouter.post("/resend-otp", authController.resendOtp);   // Resend OTP
authRouter.post("/login", authController.login);            // Login
authRouter.get("/me", isAuthenticated, authController.getAuthUser); //Auth User
authRouter.post("/refresh", authController.refresh);        // Refresh Token
// Password reset routes
authRouter.post("/request-password-reset", authController.requestPasswordReset);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
