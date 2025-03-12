import { Professor } from "../models/professor.model.js";
import bcrypt from "bcryptjs";
import { profTokenAndCookie } from "../utils/profTokenAndCookie.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendProfessorWelcomeEmail,
} from "../mailtrap/emails.js";
import admin from "../utils/firebaseAdmin.js";
import jwt from "jsonwebtoken";

//login
export const loginProfessor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const professor = await Professor.findOne({ email });

    if (!professor) {
      console.log("Professor not found");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // ✅ If user signed up via Google, do NOT check password
    if (!professor.password) {
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

    profTokenAndCookie(res, professor._id);

    professor.lastLogin = new Date();
    await professor.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
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

export const getProfessorById = async (req, res) => {
  // Get the professorId from the URL parameters
  const { professorId } = req.params;
  console.log("Professor ID:", professorId);

  try {
    const professor = await Professor.findById(professorId);

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    console.log("Number of Courses:", professor.courseCount);

    res.status(200).json({
      professor,
      courseCount: professor.courseCount,
    });
  } catch (error) {
    console.error("Error fetching professor:", error);
    res.status(500).json({
      message: "Error fetching professor",
      error: error.message,
    });
  }
};

//checkAuth
// export const checkAuthProfessor = async (req, res) => {
//   console.log("Decoded Token Data:", req.user); // ✅ Debugging log

//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No professor ID found",
//       });
//     }

//     const professor = await Professor.findById(req.user.id).select("-password");

//     if (!professor) {
//       return res.status(404).json({
//         success: false,
//         message: "Professor not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       professor,
//     });
//   } catch (error) {
//     console.error("Error in checkAuthProfessor:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const checkAuthProfessor = async (req, res) => {
  console.log("🔍 Checking authentication..."); // ✅ Debugging

  const token = req.cookies.token; // ✅ Uses Cookie instead
  console.log(
    "📌 Token received:",
    token ? "✅ Token exists" : "❌ No token found"
  );

  if (!token) {
    console.warn("🚨 Unauthorized access attempt - No token provided.");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // ✅ Log decoded token

    const professor = await Professor.findById(decoded.professorId).select(
      "-password"
    );
    console.log(
      "📌 Professor lookup:",
      professor ? "✅ Found" : "❌ Not Found"
    );

    if (!professor) {
      console.warn("🚨 Professor not found for ID:", decoded.professorId);
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });
    }

    console.log("✅ Authentication successful for professor:", professor.email);
    res.status(200).json({ success: true, professor });
  } catch (error) {
    console.error("❌ Error verifying token:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
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

//SSO
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

//register profeqssor
// export const registerProfessor = async (req, res) => {
//   try {
//     const { firstName, lastName, email, institutionId } = req.body;

//     if (!firstName || !lastName || !email || !institutionId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }

//     const existingProfessor = await Professor.findOne({ email });

//     if (existingProfessor) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Professor already exists" });
//     }

//     const plainPassword = lastName.trim();
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const newProfessor = new Professor({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       institution: institutionId, // ✅ Ensure institution ID is set
//     });

//     const savedProfessor = await Professor.findById(
//       savedProfessor._id
//     ).populate("institution", "institutionName");

//     await sendProfessorWelcomeEmail(
//       savedProfessor.email,
//       savedProfessor.firstName,
//       savedProfessor.lastName,
//       plainPassword, // Send lastName as their temporary password
//       savedProfessor.institution.institutionName
//     );

//     res.status(201).json({
//       success: true,
//       message: "Professor registered successfully",
//       professor: { ...savedProfessor._doc, password: undefined }, // ✅ Hide password in response
//       token, // ✅ Ensure token is included in the response
//     });
//   } catch (error) {
//     console.error("Error in registerProfessor:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const registerProfessor = async (req, res) => {
  try {
    const { firstName, lastName, email, institutionId } = req.body;

    if (!firstName || !lastName || !email || !institutionId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if professor already exists
    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res
        .status(400)
        .json({ success: false, message: "Professor already exists" });
    }

    // Generate temporary password (using last name)
    const plainPassword = lastName.trim();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new professor object
    const newProfessor = new Professor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      institution: institutionId, // ✅ Ensure institution ID is set
    });

    // Save professor to database first
    let savedProfessor = await newProfessor.save();

    // Fetch again with institution details
    savedProfessor = await Professor.findById(savedProfessor._id).populate(
      "institution",
      "institutionName"
    );

    // ✅ Ensure institutionName is defined
    const institutionName =
      savedProfessor.institution?.institutionName || "Your Institution";

    // Send email with login details
    await sendProfessorWelcomeEmail(
      savedProfessor.email,
      savedProfessor.firstName,
      savedProfessor.lastName,
      plainPassword, // Send lastName as temporary password
      institutionName
    );

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedProfessor._id, institutionId: savedProfessor.institution._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Convert to plain object and remove password before sending response
    const responseProfessor = savedProfessor.toObject();
    delete responseProfessor.password;

    res.status(201).json({
      success: true,
      message: "Professor registered successfully",
      professor: responseProfessor, // ✅ Hide password in response
      token, // ✅ Include token
    });
  } catch (error) {
    console.error("Error in registerProfessor:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//fetch professor
export const getProfessors = async (req, res) => {
  try {
    // Ensure institutionId is available from authentication middleware
    if (!req.institutionId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Institution ID missing.",
      });
    }

    // Fetch students that belong to the authenticated institution
    const professors = await Professor.find({
      institution: req.institutionId,
    }).populate("institution", "institutionName");

    res.status(200).json({
      success: true,
      professors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update prof info
export const updateProfessor = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const updateProfessor = await Professor.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        password,
      },
      { new: true }
    );

    if (!updateProfessor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Professor updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete  prof account
export const deleteProfessor = async (req, res) => {
  try {
    const deleteProfessor = await Professor.findByIdAndDelete(req.params.id);

    if (!deleteProfessor) {
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Professor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
