import express from "express";
import {
  createCourseField,
  getCourseFieldsByType,
  getCourseFieldById,
  updateCourseField,
  deleteCourseField,
} from "../controllers/courseField.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Create a new course field
router.post("/", createCourseField);

// Get all course fields for a specific type (e.g., ClassName, Program)
router.get("/type/:type", getCourseFieldsByType);

// Get a specific course field by ID
router.get("/:id", getCourseFieldById);

// Update a course field by ID
router.put("/update/:id", updateCourseField);

// Delete a course field by ID
router.delete("/delete/:id", deleteCourseField);

export default router;
