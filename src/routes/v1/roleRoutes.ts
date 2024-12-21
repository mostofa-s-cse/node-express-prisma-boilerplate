import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { checkPermission } from "../../middlewares/checkPermission"; // Import your custom permission check
import * as roleController from "../../ controllers/v1/roleController"; // Import your role controller

const roleRouter = Router();

// Create role - requires authentication and permission to manage roles
roleRouter.post(
    "/",
    isAuthenticated,
    checkPermission("create-roles"),  // Check if the user has permission
    roleController.createRole
);

// Get all roles - requires authentication and permission to view roles
roleRouter.get(
    "/",
    isAuthenticated,
    checkPermission("view-roles"),  // Check if the user has permission
    roleController.getAllRoles
);

// Update a specific role - requires authentication and permission to update roles
roleRouter.put(
    "/:id",
    isAuthenticated,
    checkPermission("update-roles"),  // Check if the user has permission
    roleController.updateRole
);

// Delete a specific role - requires authentication and permission to delete roles
roleRouter.delete(
    "/:id",
    isAuthenticated,
    checkPermission("delete-roles"),  // Check if the user has permission
    roleController.deleteRole
);

// Assign a role to a user
roleRouter.post(
    "/assign-role",
    isAuthenticated,
    checkPermission("assign-roles"),  // Check if the user has permission
    roleController.assignRoleToUser);

// Get all roles of a user
roleRouter.get(
    "/:userId/roles",
    isAuthenticated,
    checkPermission("view-roles"),  // Check if the user has permission
    roleController.getUserRoles);

export default roleRouter;
