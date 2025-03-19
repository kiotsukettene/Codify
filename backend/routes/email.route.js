import express from "express";
import { sendEmailController } from "../controllers/email.controller.js"; // Import email controller

const router = express.Router();

// Define the POST route for sending emails
router.post("/send-email", sendEmailController);

export default router;
