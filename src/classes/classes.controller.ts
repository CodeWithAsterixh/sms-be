import { Request, Response } from "express";
import * as classService from "./classes.service";
import { throwError } from "../../lib/middlewares/error-handler";

export async function createClass(req: Request, res: Response) {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json({ success: true, data: cls });
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === '23505') throwError(409, "Class already exists", error.detail);
    throwError(500, error.message || "Failed to create class");
  }
}

export async function getClasses(req: Request, res: Response) {
  try {
    const classes = await classService.getAllClasses();
    res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch classes");
  }
}
