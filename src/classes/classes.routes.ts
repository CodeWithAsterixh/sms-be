import { Router } from "express";
import { createClass, getClasses } from "./classes.controller";
import { validate } from "../../lib/middlewares/validate";
import { createClassSchema } from "./classes.validators";
import { authenticate, authorizePermissions } from "../../lib/middlewares/auth";

const router = Router();

router.post("/", authenticate, authorizePermissions("manage_classes"), validate(createClassSchema), createClass);
router.get("/", authenticate, authorizePermissions("view_classes"), getClasses);


export default router;
