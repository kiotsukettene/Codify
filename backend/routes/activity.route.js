import express from "express";
import {
  createActivity,
  getActivitiesByLesson,
  updateActivity,
  deleteActivity,
  getActivitiesByCourse,
  getActivityById,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/create", createActivity);
router.get("/:activityId", getActivityById);
router.get("/lesson/:lessonId", getActivitiesByLesson);
router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);
router.get("/course/:courseId", getActivitiesByCourse);

export default router;
