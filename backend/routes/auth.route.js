import express from 'express';
import { 
     loginInstitution,
     registerInstitution, 
     logoutInstitution, 
     verifyEmail, 
     forgotPassword,
     resetPassword,
     checkAuth,
     markAsPaid

} from '../controllers/auth.controller.js';

import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();


router.get("/check-auth",  verifyToken, checkAuth)
router.post("/signup", registerInstitution)

router.post("/login", loginInstitution)

router.post("/logout", logoutInstitution)

router.post("/verify-email", verifyEmail)
router.post("/mark-as-paid", markAsPaid)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router;

