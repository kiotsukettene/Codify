import express from "express";
import {
  createActivity,
  getActivitiesByLesson,
  updateActivity,
  deleteActivity,
  getActivitiesByCourse,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/create", createActivity);
router.get("/lesson/:lessonId", getActivitiesByLesson);
router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);
router.get("/course/:courseId", getActivitiesByCourse);

export default router;
