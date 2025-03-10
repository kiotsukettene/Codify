import express from "express";
import {
  getStudentSolvedChallenges,
  fetchSolvedProblems,
} from "../controllers/studentSolvedChallenges.controller.js";
import { StudentVerifyToken } from '../middleware/studentVerifyToken.js';

const router = express.Router();

router.post('/update-solved-challenges',  getStudentSolvedChallenges);
router.get('/fetch-solved-challenges/:studentId', StudentVerifyToken, fetchSolvedProblems);

export default router;