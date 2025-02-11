import { Professor } from "../models/professor.model.js";
import bcrypt from "bcryptjs";
import { profTokenAndCookie } from "../utils/profTokenAndCookie.js";
import crypto from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import admin from "../utils/firebaseAdmin.js";

//login
export const loginProfessor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const professor = await Professor.findOne({ email });
    console.log("Professor query result:", professor);

    if (!professor) {
      console.log("Professor not found");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // ✅ If user signed up via Google, do NOT check password
    if (!professor.password) {
      console.log("Google user detected, bypassing password check.");
      const token = profTokenAndCookie(res, professor._id);

      professor.lastLogin = new Date();
      await professor.save();

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        token,
        professor: {
          ...professor._doc,
          password: undefined, // Remove password from response
        },
      });
    }

    // ✅ Regular login: Check password
    const isPasswordValid = await bcrypt.compare(password, professor.password);
    if (!isPasswordValid) {
      console.log("Professor password not valid");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = profTokenAndCookie(res, professor._id);

    professor.lastLogin = new Date();
    await professor.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      professor: {
        ...professor._doc,
        password: undefined, // Hide password from response
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

//logout
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

//checkAuth
export const checkAuthProfessor = async (req, res) => {
  const professor = await Professor.findById(req.professorId).select(
    "-password"
  );

  if (!professor) {
    return res.status(400).json({
      success: false,
      message: "professor not found",
    });
  }

  res.status(200).json({
    success: true,
    professor,
  });
};

//ForgotPass
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

//ResetPass
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

//register profeqssor
export const registerProfessor = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    // Validate the data
    if (!email || !firstName || !lastName) {
      throw new Error("All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const profAlreadyExists = await Professor.findOne({ email });
    if (profAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Professor already has an account",
      });
    }

    // Hash the last name as the password
    const hashedPassword = await bcrypt.hash(lastName, 10);

    // Create and save the professor
    const newProfessor = new Professor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedProfessor = await newProfessor.save();

    // Generate a token and set cookie
    profTokenAndCookie(res, savedProfessor._id);

    // Send success email
    await sendResetSuccessEmail(savedProfessor.email);

    res.status(201).json({
      success: true,
      message: "Professor registered successfully",
      professor: {
        ...savedProfessor._doc,
        password: undefined, // Hide password from response
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//SSO
// export const googleLoginProfessor = async (req, res) => {
//   const { token } = req.body;

//   try {
//     // Verify Firebase ID Token
//     const decodedToken = await professor.auth().verifyIdToken(token);
//     const email = decodedToken.email;

//     let professor = await Professor.findOne({ email });

//     if (!professor) {
//       return res.status(400).json({
//         success: false,
//         message: "No registered institution found with this email",
//       });
//     }

//     profTokenAndCookie(res, professor._id);

//     res.status(200).json({ success: true, professor });
//   } catch (error) {
//     console.error("Error verifying Firebase token", error);
//     res.status(401).json({ success: false, message: "Invalid Google token" });
//   }
// };
export const googleLoginProfessor = async (req, res) => {
  const { token } = req.body;

  try {
    console.log("📌 Received Token in Backend:", token); // ✅ Debugging

    if (!token) {
      console.error("❌ Token is missing!");
      return res
        .status(400)
        .json({ success: false, message: "Token is missing" });
    }

    // ✅ FIXED: Verify Firebase Token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Token:", decodedToken);

    const email = decodedToken.email;
    console.log("📌 Searching for professor with email:", email);

    // ✅ FIXED: Rename variable to avoid conflict
    let professorUser = await Professor.findOne({ email });

    if (!professorUser) {
      console.error("❌ No registered professor found for:", email);
      return res.status(400).json({
        success: false,
        message: "No registered institution found with this email",
      });
    }

    // ✅ FIXED: Use correct variable name
    profTokenAndCookie(res, professorUser._id);

    console.log("✅ Found Professor:", professorUser);
    res.status(200).json({ success: true, professor: professorUser });
  } catch (error) {
    console.error("❌ Error verifying Firebase token:", error);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};
