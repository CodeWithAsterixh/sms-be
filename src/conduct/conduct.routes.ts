import { Router } from "express";
import { 
  createConductRecord, 
  getStudentConductRecords, 
  updateConductRecord, 
  deleteConductRecord 
} from "./conduct.controller";
import { validateConductRecord } from "./conduct.validators";
import { authenticate, authorizeRoles } from "../../lib/middlewares/auth";

const router = Router();

// Create: Admin, Principal, Teacher
router.post(
  "/", 
  authenticate, 
  authorizeRoles("admin", "principal", "teacher"), 
  validateConductRecord, 
  createConductRecord
);

// Read: Admin, Principal, Teacher
router.get(
  "/student/:studentId", 
  authenticate, 
  authorizeRoles("admin", "principal", "teacher"), 
  getStudentConductRecords
);

// Update: Admin, Principal
router.patch(
  "/:id", 
  authenticate, 
  authorizeRoles("admin", "principal"), 
  updateConductRecord
);

// Delete: Admin, Principal
router.delete(
  "/:id", 
  authenticate, 
  authorizeRoles("admin", "principal"), 
  deleteConductRecord
);

export default router;
