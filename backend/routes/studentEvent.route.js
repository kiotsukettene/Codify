import express from "express";
import { addEvent, getEvents } from "../controllers/studentEvent.controller.js";
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js";

const router = express.Router();

// Health check route for debugging
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Event routes are working" });
});

// Routes that require authentication
router.post("/schedule", StudentVerifyToken, addEvent);
router.get("/", StudentVerifyToken, getEvents);

export default router;