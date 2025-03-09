import express from "express";
import {
  createCourse,
  getCoursesByProfessor,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/create", createCourse);
router.get("/:professorId", getCoursesByProfessor);
router.get("/course/:courseId", getCourseBySlug);
router.put("/update/:courseId", updateCourse);
router.delete("/delete/:courseId", deleteCourse);

export default router;
