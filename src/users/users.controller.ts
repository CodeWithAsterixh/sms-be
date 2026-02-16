import { Request, Response } from "express";
import * as userService from "./users.service";
import { th } from "zod/v4/locales";
import { throwError } from "../../lib/middlewares/error-handler";

export async function createUser(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === '23505') throwError(409, "User already exists", error.detail);
    throwError(500, error.message || "Failed to create user");
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch users");
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) throwError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throwError(500, error.message || "Failed to fetch user");
  }
}
