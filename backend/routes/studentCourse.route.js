import express from 'express';
import {
    joinCourse,
    getEnrolledCourses,
    getLessonsForCourse,
} from '../controllers/studentCourse.controller.js';
import { StudentVerifyToken } from '../middleware/studentVerifyToken.js';

const router = express.Router();

// All routes require student authentication

router.post("/join", StudentVerifyToken, joinCourse);
router.get("/enrolled", StudentVerifyToken, getEnrolledCourses);
router.get("/lessons/:courseId", StudentVerifyToken, getLessonsForCourse);

export default router;