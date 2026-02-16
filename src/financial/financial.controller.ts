import { Request, Response } from "express";
import * as financialService from "./financial.service";
import { throwError } from "../../lib/middlewares/error-handler";
import { CreateFinancialRecordDTO, UpdateFinancialRecordDTO } from "./index";

export async function createFinancialRecord(req: Request, res: Response) {
  try {
    const { student_id, academic_session, term, payment_status, amount_paid, amount_due } = req.body;
    const user = (req as any).user;

    if (!user) throwError(401, "Unauthorized");

    const data: CreateFinancialRecordDTO = {
      student_id,
      academic_session,
      term,
      payment_status,
      amount_paid,
      amount_due,
      recorded_by: user.id
    };

    const record = await financialService.createFinancialRecord(data);
    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to create financial record");
  }
}

export async function getStudentFinancialRecords(req: Request, res: Response) {
  try {
    const student_id = Number(req.params.studentId);
    if (isNaN(student_id)) throwError(400, "Invalid student ID");

    const records = await financialService.getStudentFinancialRecords(student_id);
    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch financial records");
  }
}

export async function updateFinancialRecord(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throwError(400, "Invalid record ID");

    const { payment_status, amount_paid, amount_due } = req.body;
    const data: UpdateFinancialRecordDTO = { payment_status, amount_paid, amount_due };

    const record = await financialService.updateFinancialRecord(id, data);
    if (!record) throwError(404, "Record not found");

    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to update financial record");
  }
}
