import { Request, Response } from "express";
import * as studentService from "./students.service";
import { AuthRequest } from "../../types/auth";
import { throwError } from "../../lib/middlewares/error-handler";

export async function createStudent(req: AuthRequest, res: Response) {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === '23505') throwError(409, "Student already exists", error.detail);
    throwError(500, error.message || "Failed to create student");
  }
}

export async function getStudents(req: AuthRequest, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const classId = req.query.classId ? Number(req.query.classId) : undefined;
    const status = req.query.status as string;

    const result = await studentService.getAllStudents(page, limit, search, classId, status);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch students");
  }
}

export async function getStudent(req: AuthRequest, res: Response) {
  try {
    const id = String(req.params.id);
    // Check if it's a number (ID) or string (UID)
    const queryId = /^\d+$/.test(id) ? Number(id) : id;
    
    const student = await studentService.getStudentById(queryId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch student");
  }
}

export async function updateStudent(req: AuthRequest, res: Response) {
  try {
    const id = String(req.params.id);
    // Check if it's a number (ID) or string (UID)
    const queryId = /^\d+$/.test(id) ? Number(id) : id;

    const student = await studentService.updateStudent(queryId, req.body);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to update student");
  }
}

export async function getClassHistory(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const history = await studentService.getClassHistory(id);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    throwError(500, error.message || "Failed to fetch class history");
  }
}

export async function uploadProfileImage(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      return throwError(400, "No file uploaded");
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
        return throwError(400, "Invalid student ID");
    }

    // Construct the URL path (relative to server root)
    const relativePath = `/uploads/students/${id}/${req.file.filename}`;
    
    const student = await studentService.updateProfileImage(id, relativePath);
    
    if (!student) {
        return throwError(404, "Student not found");
    }

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to upload profile image");
  }
}
