import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

const router = express.Router();

router.post("/create", createLesson);
router.get("/:courseId", getLessonsByCourse);
router.get("/lesson/:lessonId", getLessonById);
router.put("/update/:lessonId", updateLesson);
router.delete("/delete/:lessonId", deleteLesson);

export default router;
