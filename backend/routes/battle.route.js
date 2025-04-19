import express from "express";
import {
  createBattle,
  getCoursesForBattle,
  getBattlesByProfessor,
  getLeaderboard,
  deleteBattle,
  updateBattle,
} from "../controllers/battle.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";


const router = express.Router();

router.post("/create", profVerifyToken, createBattle);
router.get("/courses", profVerifyToken, getCoursesForBattle);
router.get("/professor", profVerifyToken, getBattlesByProfessor); // New endpoint
router.get("/leaderboard", profVerifyToken, getLeaderboard); // New endpoint
router.delete("/:id", profVerifyToken, deleteBattle);
router.put("/:id", profVerifyToken, updateBattle);

export default router;