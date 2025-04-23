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
  getBattleById,
  getBattleByIdForProfessor,
  markNotificationAsRead,
} from "../controllers/battle.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js";
import Battle  from "../models/battle.model.js";


const router = express.Router();

router.post("/create", profVerifyToken, createBattle);
router.get("/courses", profVerifyToken, getCoursesForBattle);
router.get("/professor", profVerifyToken, getBattlesByProfessor); // New endpoint
router.get("/leaderboard", profVerifyToken, getLeaderboard); // New endpoint
router.delete("/:id", profVerifyToken, deleteBattle);
router.put("/:id", profVerifyToken, updateBattle);
router.post("/join/:battleCode", StudentVerifyToken, joinBattle);
router.get("/student", StudentVerifyToken, getStudentBattles);
router.get("/:battleCode", StudentVerifyToken, getBattleById); // Add new route
router.get("/professor/:battleCode", profVerifyToken, getBattleByIdForProfessor);
router.patch('/:battleCode/notifications/:notificationId', StudentVerifyToken, markNotificationAsRead);
router.post('/notifications', async (req, res) => {
  try {
    const { battleId, notifications } = req.body;
    
    await Battle.findByIdAndUpdate(battleId, {
      $push: { notifications: { $each: notifications } }
    });

    res.status(200).json({ message: 'Notifications stored successfully' });
  } catch (error) {
    console.error('Error storing notifications:', error);
    res.status(500).json({ message: 'Failed to store notifications' });
  }
});

export default router;