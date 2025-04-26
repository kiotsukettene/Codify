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
  updateBattleStatus,
} from "../controllers/battle.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js";
import Battle  from "../models/battle.model.js";


const router = express.Router();

router.post("/create", profVerifyToken, createBattle);
router.get("/courses", profVerifyToken, getCoursesForBattle);
router.get("/professor", profVerifyToken, getBattlesByProfessor);
router.get("/leaderboard", profVerifyToken, getLeaderboard);
router.delete("/:id", profVerifyToken, deleteBattle);
router.put("/:id", profVerifyToken, updateBattle);
router.post("/join/:battleCode", StudentVerifyToken, joinBattle);
router.get("/student", StudentVerifyToken, getStudentBattles);
router.get("/professor/:battleCode", profVerifyToken, getBattleByIdForProfessor);
router.patch('/:battleCode/notifications/:notificationId', StudentVerifyToken, markNotificationAsRead);
router.post('/:battleCode/progress/:challengeId', StudentVerifyToken, async (req, res) => {
  try {
    const battle = await Battle.findOne({ battleCode: req.params.battleCode });
    
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const updatedChallenge = await battle.updateChallengeProgress(
      req.params.challengeId,
      req.studentId,
      req.body
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(updatedChallenge);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ 
      message: "Failed to update challenge progress",
      error: error.message 
    });
  }
});
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
router.put("/:battleCode/status", profVerifyToken, updateBattleStatus);

// This generic route should be last
router.get("/:battleCode", StudentVerifyToken, async (req, res) => {
  try {
    const battle = await Battle.findOne({ battleCode: req.params.battleCode })
      .populate('player1', 'firstName lastName')
      .populate('player2', 'firstName lastName');
    
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // Ensure challenges array exists
    if (!Array.isArray(battle.challenges) || battle.challenges.length === 0) {
      return res.status(400).json({ message: "No challenges found in this battle" });
    }

    // Format the response data
    const responseData = {
      battleCode: battle.battleCode,
      title: battle.title,
      description: battle.description,
      duration: battle.duration,
      commencement: battle.commencement,
      status: battle.status,
      player1: {
        id: battle.player1._id,
        name: `${battle.player1.firstName} ${battle.player1.lastName}`
      },
      player2: {
        id: battle.player2._id,
        name: `${battle.player2.firstName} ${battle.player2.lastName}`
      },
      challenges: battle.challenges.map(challenge => ({
        challengeId: challenge.challengeId,
        problemTitle: challenge.problemTitle,
        problemDescription: challenge.problemDescription,
        points: challenge.points,
        inputConstraints: challenge.inputConstraints || [],
        expectedOutput: challenge.expectedOutput || [],
        functionName: challenge.functionName,
        numArguments: challenge.numArguments,
        playerProgress: challenge.playerProgress || []
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching battle:", error);
    res.status(500).json({ 
      message: "Error fetching battle details",
      error: error.message 
    });
  }
});

export default router;