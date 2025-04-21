import express from "express";
import {
  createBattle,
  getCoursesForBattle,
  getBattlesByProfessor,
  getLeaderboard,
  deleteBattle,
  updateBattle,
  joinBattle,
  getStudentBattles,
} from "../controllers/battle.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js";


const router = express.Router();

router.post("/create", profVerifyToken, createBattle);
router.get("/courses", profVerifyToken, getCoursesForBattle);
router.get("/professor", profVerifyToken, getBattlesByProfessor); // New endpoint
router.get("/leaderboard", profVerifyToken, getLeaderboard); // New endpoint
router.delete("/:id", profVerifyToken, deleteBattle);
router.put("/:id", profVerifyToken, updateBattle);
router.post("/join/:battleId", StudentVerifyToken, joinBattle);
router.get("/student", StudentVerifyToken, getStudentBattles);



export default router;