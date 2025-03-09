import express from "express";
import {
  createCourse,
  getCoursesByProfessor,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";

const router = express.Router();

router.post("/create", createCourse);
router.get("/courses", profVerifyToken, getCoursesByProfessor);
router.get("/course/:courseId", getCourseById);
router.put("/update/:courseId", updateCourse);
router.delete("/delete/:courseId", deleteCourse);

export default router;
