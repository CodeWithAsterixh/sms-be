import { Router } from "express";
import { authenticate, authorizeRoles, authorizePermissions } from "../../lib/middlewares/auth";
import { validate } from "../../lib/middlewares/validate";
import { createUser, getUser, getUsers } from "./users.controller";
import { createUserSchema } from "./users.validators";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("manage_users"),
  validate(createUserSchema),
  createUser,
);
router.get("/", authenticate, authorizePermissions("view_users"), getUsers);
router.get("/:id", authenticate, authorizePermissions("view_users"), getUser);

export default router;
