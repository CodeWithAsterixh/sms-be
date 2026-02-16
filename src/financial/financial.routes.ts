import { Router } from "express";
import { 
  createFinancialRecord, 
  getStudentFinancialRecords, 
  updateFinancialRecord 
} from "./financial.controller";
import { validateFinancialRecord } from "./financial.validators";
import { authenticate, authorizeRoles } from "../../lib/middlewares/auth";

const router = Router();

// Create: Admin only
router.post(
  "/", 
  authenticate, 
  authorizeRoles("admin"), 
  validateFinancialRecord, 
  createFinancialRecord
);

// Read: Admin, Principal
router.get(
  "/student/:studentId", 
  authenticate, 
  authorizeRoles("admin", "principal"), 
  getStudentFinancialRecords
);

// Update: Admin only
router.patch(
  "/:id", 
  authenticate, 
  authorizeRoles("admin"), 
  updateFinancialRecord
);

export default router;
