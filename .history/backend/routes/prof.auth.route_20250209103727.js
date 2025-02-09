import express from "express";
import { resetPasswordProfessor } from "../controllers/prof.auth.controller.js";

const profrouter = express.Router();
router.post("/professor/reset-password/:token", resetPasswordProfessor);

export default profrouter;
