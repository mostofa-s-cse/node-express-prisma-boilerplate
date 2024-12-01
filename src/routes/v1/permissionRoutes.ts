import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { checkPermission } from "../../middlewares/checkPermission"; // Import your custom permission check
import * as permissionController from "../../ controllers/v1/permissionController"; // Import your permission controller

const permissionRouter = Router();

// Create permission - requires authentication and permission to create permissions
permissionRouter.post(
    "/",
    isAuthenticated,
    checkPermission("create-permissions"),  // Check if the user has permission
    permissionController.createPermission
);

// Get all permissions - requires authentication and permission to view permissions
permissionRouter.get(
    "/",
    isAuthenticated,
    checkPermission("view-permissions"),  // Check if the user has permission
    permissionController.getAllPermissions
);

// Update permission - requires authentication and permission to update permissions
permissionRouter.put(
    "/:id",
    isAuthenticated,
    checkPermission("update-permissions"),  // Check if the user has permission
    permissionController.updatePermission
);

// Delete permission - requires authentication and permission to delete permissions
permissionRouter.delete(
    "/:id",
    isAuthenticated,
    checkPermission("delete-permissions"),  // Check if the user has permission
    permissionController.deletePermission
);

// Route for assigning permission to a role - requires authentication and permission to assign permissions
permissionRouter.post(
    "/assign-permission",
    isAuthenticated,
    checkPermission("assign-permissions"),  // Check if the user has permission
    permissionController.assignPermissionToRole
);

export default permissionRouter;
