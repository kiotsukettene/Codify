import express from "express";
import {
  createActivity,
  getActivitiesByLesson,
  updateActivity,
  deleteActivity,
  getActivitiesByCourse,
  getActivityById,
  getActivityBySlug,
  createSubmission,
  getStudentAllActivities,
  getSubmission,
  unsubmitActivity,
} from "../controllers/activity.controller.js";
import upload from "../middleware/multerConfig.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js"; // Adjust path
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js"; // Adjust path
const router = express.Router();

router.post("/create", profVerifyToken, upload.single("file"), createActivity);
router.get("/:activityId", profVerifyToken, getActivityById);
router.get("/lesson/:lessonId", profVerifyToken, getActivitiesByLesson);
router.get("/slug/:slug", profVerifyToken, getActivityBySlug); // New route
router.put(
  "/:activityId",
  profVerifyToken,
  upload.single("file"),
  updateActivity
);
router.delete("/:activityId", profVerifyToken, deleteActivity);
router.get("/course/:courseId", profVerifyToken, getActivitiesByCourse);

router.post(
  "/submit",
  StudentVerifyToken,
  upload.single("file"), // Use multer to handle file upload
  createSubmission
);

router.get(
  "/student/all-activities",
  StudentVerifyToken,
  getStudentAllActivities
);

router.get("/submission/:activityId", StudentVerifyToken, getSubmission);
router.delete("/submission/:activityId", StudentVerifyToken, unsubmitActivity);

export default router;
