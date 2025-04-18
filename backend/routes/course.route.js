import express from "express";
import {
  createCourse,
  getCoursesByInstitution,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByProfessor,
  getUniqueStudentCountByProfessor,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createCourse);
router.get("/courses", verifyToken, getCoursesByInstitution);
router.get("/professor/courses", profVerifyToken, getCoursesByProfessor);
router.get(
  "/professor/unique-student-count",
  profVerifyToken,
  getUniqueStudentCountByProfessor
);
router.get("/course/:courseId", getCourseById);
router.put("/update/:courseId", updateCourse);
router.delete("/delete/:courseId", deleteCourse);

export default router;
