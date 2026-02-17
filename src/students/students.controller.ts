import { Request, Response } from "express";
import * as studentService from "./students.service";
import { AuthRequest } from "../../types/auth";
import { throwError } from "../../lib/middlewares/error-handler";
import crypto from "crypto";
import path from "path";
import { supabase, STORAGE_BUCKET } from "../../lib/supabase";
import { STUDENT } from ".";

// Helper function to handle image upload logic
async function processImageUpload(student: STUDENT, file: Express.Multer.File, userId: string | number): Promise<STUDENT> {
  // 1. Calculate hash
  const fileBuffer = file.buffer;
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex").substring(0, 10);

  // 2. Check for duplicates
  const isDuplicate = await studentService.checkDuplicateImage(hash);
  if (isDuplicate) {
      throwError(409, "Duplicate image detected. This image has already been uploaded.");
  }

  // 3. Construct filename
  const studentName = `${student.first_name}_${student.last_name}`.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const uploadedByUserId = userId || "unknown";
  
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, "");
  
  const ext = path.extname(file.originalname);
  const filename = `students/${student.id}/${studentName}_${uploadedByUserId}_${yyyymmdd}_${hhmmss}_${hash}${ext}`;

  // 4. Upload to Supabase
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, fileBuffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throwError(500, "Failed to upload image to storage");
  }

  // 5. Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);
    
  const publicUrl = publicUrlData.publicUrl;

  // 6. Update student record
  const updatedStudent = await studentService.updateProfileImage(student.id, publicUrl, hash);
  
  if (!updatedStudent) {
    throwError(500, "Failed to update student record after upload");
  }

  return updatedStudent!;
}

export async function createStudent(req: AuthRequest, res: Response) {
  try {
    const student = await studentService.createStudent(req.body);
    
    if (req.file) {
      try {
        const userId = req.user?.id || "unknown";
        const updatedStudent = await processImageUpload(student, req.file, userId);
        return res.status(201).json({ success: true, data: updatedStudent });
      } catch (uploadError) {
        console.error("Image upload failed during creation:", uploadError);
        // Return student without image if upload fails, but maybe include a warning message?
        // For now, just return the student created.
        return res.status(201).json({ success: true, data: student, message: "Student created but image upload failed" });
      }
    }

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

    // 1. Fetch student to get name and verify existence
    const student = await studentService.getStudentById(id);
    if (!student) {
        return throwError(404, "Student not found");
    }

    const userId = req.user?.id || "unknown";
    const updatedStudent = await processImageUpload(student, req.file, userId);
    
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to upload profile image");
  }
}
