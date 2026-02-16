import { Request, Response } from "express";
import * as announcementService from "./announcements.service";
import { throwError } from "../../lib/middlewares/error-handler";

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const announcement = await announcementService.createAnnouncement(req.body);
    res.status(201).json({ success: true, data: announcement });
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === '23503') throwError(400, "Invalid class ID", error.detail);
    throwError(500, error.message || "Failed to create announcement");
  }
}

export async function getAnnouncements(req: Request, res: Response) {
  try {
    const student_id = Number(req.params.student_id);
    const announcements = await announcementService.getAnnouncementsByStudent(student_id);
    res.status(200).json({ success: true, data: announcements });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch announcements");
  }
}
