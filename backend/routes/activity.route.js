import express from "express";
import {
  createActivity,
  getActivitiesByLesson,
  updateActivity,
  deleteActivity,
  getActivitiesByCourse,
  getActivityById,
} from "../controllers/activity.controller.js";
import upload from "../middleware/multerConfig.js"; // ✅ Import multer config

const router = express.Router();

router.post("/create", upload.single("file"), createActivity); // ✅ Enable file upload
router.get("/:activityId", getActivityById);
router.get("/lesson/:lessonId", getActivitiesByLesson);
router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);
router.get("/course/:courseId", getActivitiesByCourse);

export default router;
