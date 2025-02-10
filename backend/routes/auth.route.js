import express from "express";
import {
  loginInstitution,
  registerInstitution,
  logoutInstitution,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";

import {
  loginProfessor,
  logoutProfessor,
  ForgotPasswordProfessor,
  resetPasswordProfessor,
  registerProfessor,
  googleAuthProfessor,
  googleCallbackProfessor,
  googleSuccessProfessor,
} from "../controllers/prof.auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", registerInstitution);

router.post("/login", loginInstitution);

router.post("/logout", logoutInstitution);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Professor routes
router.post("/professor-login", loginProfessor);
router.post("/professor-logout", logoutProfessor);
router.post("/professor-forgot-password", ForgotPasswordProfessor);
router.post("/professor-reset-password/:token", resetPasswordProfessor);
router.post("/professor-register", registerProfessor);
router.get("/professor-google", googleAuthProfessor);
router.get(
  "/professor-google/callback",
  googleCallbackProfessor,
  googleSuccessProfessor
);

export default router;
