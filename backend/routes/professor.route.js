import express from "express";
import {
  loginProfessor,
  logoutProfessor,
  ForgotPasswordProfessor,
  resetPasswordProfessor,
  registerProfessor,
  googleLoginProfessor,
  getProfessors,
  updateProfessor,
  deleteProfessor,
  checkAuthProfessor,
} from "../controllers/prof.auth.controller.js";
import { profVerifyToken } from "../middleware/professorVerifyToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.get("/check-auth", profVerifyToken, checkAuthProfessor);
router.post("/login", loginProfessor);
router.post("/logout", logoutProfessor);
router.post("/forgot-password", ForgotPasswordProfessor);
router.post("/password/:token", resetPasswordProfessor);
router.post("/google-login", googleLoginProfessor);
router.post("/reset-password/:token", resetPasswordProfessor);

//prof registration
router.post("/register", verifyToken, registerProfessor);
router.get("/list", verifyToken, getProfessors);
router.put("/list/update/:id", verifyToken, updateProfessor);
router.delete("/list/delete/:id", verifyToken, deleteProfessor);

export default router;
