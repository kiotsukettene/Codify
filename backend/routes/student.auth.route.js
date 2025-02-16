import express from 'express';
import { forgotPasswordStudent, loginStudent, logoutStudent, resetPasswordStudent, checkAuthStudent } from '../controllers/student.auth.controller.js';
import { StudentVerifyToken } from '../middleware/studentVerifyToken.js';

const router = express.Router();
console.log("✅ Student Auth Routes Loaded");

// ✅ Fix Route Names to Match Frontend
router.get("/check-auth", StudentVerifyToken, checkAuthStudent);
router.post('/login', loginStudent);
router.post('/logout', logoutStudent);
router.post('/forgot-password', forgotPasswordStudent);
router.post('/reset-password/:token', resetPasswordStudent);

export default router;
