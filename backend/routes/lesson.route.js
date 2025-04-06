import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonBySlug,
} from "../controllers/lesson.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";

const router = express.Router();

router.post("/create", profVerifyToken, createLesson);
router.get("/:courseId", profVerifyToken, getLessonsByCourse);
router.get("/lesson/:lessonId", profVerifyToken, getLessonById);
router.get("/slug/:slug", profVerifyToken, getLessonBySlug);
router.put("/update/:lessonId", profVerifyToken, updateLesson);
router.delete("/delete/:lessonId", profVerifyToken, deleteLesson);

export default router;
