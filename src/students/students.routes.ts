import { Router } from "express";
import { 
  createStudent, 
  getStudents, 
  getStudent, 
  updateStudent,
  getClassHistory,
  uploadProfileImage,
  getProfileImage
} from "./students.controller";
import { validate } from "../../lib/middlewares/validate";
import { createStudentSchema } from "./students.validators";
import { authenticate, authorizePermissions, authorizeRoles } from "../../lib/middlewares/auth";
import { uploadProfileImageMiddleware } from "./upload.middleware";

const router = Router();

// Profile Image Proxy
// We'll make this public to avoid auth issues when loading images in `<img>` tags
// If strict privacy is needed, we'd need to use signed URLs or pass auth tokens in image requests
// router.get(
//   "/:id/profile-image",
//   getProfileImage
// );

// Only those with manage_students permission can create students
router.post(
  "/",
  authenticate,
  authorizePermissions("manage_students"),
  uploadProfileImageMiddleware.single("image"),
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

// Profile Image Upload
router.post(
  "/:id/profile-image",
  authenticate,
  authorizePermissions("manage_students"),
  uploadProfileImageMiddleware.single("image"),
  uploadProfileImage
);

export default router;
