import { Router } from "express";
import * as controller from "./permissions.controller";
import { authenticate, authorizeRoles } from "../../lib/middlewares/auth";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles("admin")); // Only admins can manage permissions

router.get("/", controller.getAllPermissions);
router.get("/:role", controller.getRolePermissions);
router.put("/:role", controller.updateRolePermissions);

export default router;
