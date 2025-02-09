import { Professor } from "../models/professor.model.js";
import bcrypt from "bcryptjs";
import { profTokenAndCookie } from "../utils/profTokenAndCookie.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

export const loginProfessor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const professor = await Professor.findOne({ email });
    console.log("Professor query result:", professor);
    if (!professor) {
      console.log("professor not found");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, professor.password);
    if (!isPasswordValid) {
      console.log("professor pasaword not valid");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    profTokenAndCookie(res, professor._id); //

    professor.lastLogin = new Date();
    await professor.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      professor: {
        ...professor._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error logging in professor", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutProfessor = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error logging out professor", error);
    res.status(400).json({
      success: false,
      message: "Error logging out professor",
    });
  }
};

export const ForgotPasswordProfessor = async (req, res) => {
  const { email } = req.body;

  try {
    const professor = await Professor.findOne({ email });

    if (!professor) {
      return res.status(400).json({
        success: false,
        message: "Account doesn't exist",
      });
    }

    // Generate reset token and expiration time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 3600000); // 10 minutes

    console.log("Reset token:", resetToken);
    // Assign to professor model
    professor.resetPasswordToken = resetToken;
    professor.resetPasswordExpiresAt = resetTokenExpire;

    // Save changes to database
    await professor.save();
    try {
      await professor.save();
      console.log(
        "Reset token saved to DB:",
        professor.resetPasswordToken,
        "Expires at:",
        professor.resetPasswordExpiresAt
      );
    } catch (error) {
      console.error("Error saving reset token:", error);
    }

    // Sending email
    await sendPasswordResetEmail(
      professor.email,
      `${process.env.CLIENT_URL}/professor/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Email sent, please check your email to reset your password",
    });
  } catch (error) {
    console.error("Error in forgot password professor:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const resetPasswordProfessor = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const professor = await Professor.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() }, // Ensuring token isn't expired
    });

    if (!professor) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    professor.password = hashedPassword;
    professor.resetPasswordToken = undefined;
    professor.resetPasswordTokenExpiresAt = undefined;
    await professor.save();

    // Send reset success email
    await sendResetSuccessEmail(professor.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password professor:", error);
    res
      .status(400)
      .json({ success: false, message: "Error resetting password" });
  }
};
