import { Request, Response } from "express";
import * as attendanceService from "./attendance.service";
import { throwError } from "../../lib/middlewares/error-handler";

export async function recordAttendance(req: Request, res: Response) {
  try {
    const attendance = await attendanceService.recordAttendance(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === '23503') throwError(400, "Invalid student or recorder ID", error.detail);
    throwError(500, error.message || "Failed to record attendance");
  }
}

export async function getAttendance(req: Request, res: Response) {
  try {
    const student_id = Number(req.params.student_id);
    const records = await attendanceService.getAttendanceByStudent(student_id);
    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch attendance records");
  }
}

export async function deleteAttendance(req: Request, res: Response) {
  try {
    const student_id = Number(req.params.student_id);
    const type = req.query.type as 'IN' | 'OUT' | undefined;
    
    if (type && !['IN', 'OUT'].includes(type)) {
       throwError(400, "Invalid attendance type. Must be 'IN' or 'OUT'");
    }

    await attendanceService.deleteLatestAttendance(student_id, type);
    res.status(200).json({ success: true, message: `Latest ${type ? type + ' ' : ''}attendance record reverted` });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to revert attendance");
  }
}
