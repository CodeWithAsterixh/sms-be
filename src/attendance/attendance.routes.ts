import { Router } from "express";
import { recordAttendance, getAttendance, deleteAttendance } from "./attendance.controller";
import { recordAttendanceSchema } from "./attendance.validators";
import { validate } from "../../lib/middlewares/validate";
import { authenticate, authorizePermissions } from "../../lib/middlewares/auth";

const router = Router();

router.post("/", authenticate, authorizePermissions("take_attendance"), validate(recordAttendanceSchema), recordAttendance);
router.get("/student/:student_id", authenticate, authorizePermissions("view_attendance"), getAttendance);
router.delete("/student/:student_id", authenticate, authorizePermissions("take_attendance"), deleteAttendance);

export default router;
