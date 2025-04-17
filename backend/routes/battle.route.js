import express from "express";
import {
  createBattle,
  getCoursesForBattle,
} from "../controllers/battle.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";


const router = express.Router();

router.post("/create", profVerifyToken, createBattle);
router.get("/courses", profVerifyToken, getCoursesForBattle);

export default router;