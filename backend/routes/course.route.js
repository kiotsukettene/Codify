import express from "express";
import {
  createCourse,
  getCoursesByInstitution,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createCourse);
router.get("/courses", verifyToken, getCoursesByInstitution);
router.get("/course/:courseId", getCourseById);
router.put("/update/:courseId", updateCourse);
router.delete("/delete/:courseId", deleteCourse);

export default router;
