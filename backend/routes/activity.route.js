import express from "express";
import {
  createActivity,
  getActivitiesByLesson,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/lesson/:lessonId", getActivitiesByLesson);
router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);

export default router;
