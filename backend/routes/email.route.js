import express from "express";
import { sendWelcomeEmail } from "../mailtrap/emails.js"; // Import email controller

const router = express.Router();

// Define the POST route for sending emails
router.post("/send-welcome-email", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Email and name are required" });
  }

  try {
    await sendWelcomeEmail(email, name);
    res
      .status(200)
      .json({ success: true, message: "Welcome email sent successfully" });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send welcome email",
        error: error.message,
      });
  }
});

export default router;
