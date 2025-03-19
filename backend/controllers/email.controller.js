import sendEmail from "../utils/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const result = await sendEmail(req.body);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
