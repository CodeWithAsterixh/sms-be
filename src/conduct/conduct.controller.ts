import { Request, Response } from "express";
import * as conductService from "./conduct.service";
import { throwError } from "../../lib/middlewares/error-handler";
import { CreateConductRecordDTO, UpdateConductRecordDTO } from "./index";

export async function createConductRecord(req: Request, res: Response) {
  try {
    const { student_id, title, description, severity } = req.body;
    const user = (req as any).user;

    if (!user) throwError(401, "Unauthorized");

    const data: CreateConductRecordDTO = {
      student_id,
      title,
      description,
      severity,
      created_by: user.id
    };

    const record = await conductService.createConductRecord(data);
    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to create conduct record");
  }
}

export async function getStudentConductRecords(req: Request, res: Response) {
  try {
    const student_id = Number(req.params.studentId);
    if (isNaN(student_id)) throwError(400, "Invalid student ID");

    const records = await conductService.getStudentConductRecords(student_id);
    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch conduct records");
  }
}

export async function updateConductRecord(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throwError(400, "Invalid record ID");

    const { title, description, severity } = req.body;
    const data: UpdateConductRecordDTO = { title, description, severity };

    const record = await conductService.updateConductRecord(id, data);
    if (!record) throwError(404, "Record not found");

    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to update conduct record");
  }
}

export async function deleteConductRecord(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throwError(400, "Invalid record ID");

    await conductService.deleteConductRecord(id);
    res.status(200).json({ success: true, message: "Conduct record deleted" });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to delete conduct record");
  }
}
