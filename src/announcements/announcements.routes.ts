import { Router } from "express";
import { createAnnouncement, getAnnouncements } from "./announcements.controller";
import { createAnnouncementSchema } from "./announcements.validators";
import { validate } from "../../lib/middlewares/validate";
import { authenticate, authorizePermissions } from "../../lib/middlewares/auth";

const router = Router();

router.post("/", authenticate, authorizePermissions("manage_classes"), validate(createAnnouncementSchema), createAnnouncement);
router.get("/student/:student_id", authenticate, authorizePermissions("view_classes"), getAnnouncements);


export default router;
