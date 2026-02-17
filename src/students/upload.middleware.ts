import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { throwError } from "../../lib/middlewares/error-handler";

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    const studentId = req.params.id;
    if (!studentId || typeof studentId !== 'string') {
      return cb(new Error("Student ID is required and must be a string"), "");
    }

    const uploadPath = path.join(process.cwd(), "uploads", "students", studentId);

    // Create directory if it doesn't exist
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) return cb(err, "");
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalName
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .png, and .webp formats allowed!"));
  }
};

export const uploadProfileImageMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});
