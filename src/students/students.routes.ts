import { Router } from "express";
import { 
  createStudent, 
  getStudents, 
  getStudent, 
  updateStudent,
  getClassHistory
} from "./students.controller";
import { validate } from "../../lib/middlewares/validate";
import { createStudentSchema } from "./students.validators";
import { authenticate, authorizePermissions, authorizeRoles } from "../../lib/middlewares/auth";

const router = Router();

// Only those with manage_students permission can create students
router.post(
  "/",
  authenticate,
  authorizePermissions("manage_students"),
  validate(createStudentSchema),
  createStudent,
);

// Those with view_students permission can view students
router.get(
  "/",
  authenticate,
  authorizePermissions("view_students"),
  getStudents,
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("view_students"),
  getStudent,
);

// Profile Updates
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "principal"),
  updateStudent
);

// Class History
router.get(
  "/:id/class-history",
  authenticate,
  authorizeRoles("admin", "principal"),
  getClassHistory
);

export default router;
