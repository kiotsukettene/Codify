import { Student } from "../models/student.model.js";
import { Institution } from "../models/institution.model.js";
import Course from "../models/course.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendStudentWelcomeEmail,
} from "../mailtrap/emails.js";
import { studentTokenAndCookie } from "../utils/studentTokenAndCookie.js";
import admin from "../utils/firebaseAdmin.js";

export const registerStudent = async (req, res) => {
  const {
    studentId,
    firstName,
    lastName,
    email,
    course,
    year,
    section,
    institutionId,
  } = req.body;

  try {
    // Check if all required fields are provided
    if (
      !studentId ||
      !firstName ||
      !lastName ||
      !email ||
      !course ||
      !year ||
      !section ||
      !institutionId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify institution exists
    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // Check if student already exists by email and institution
    const existingStudentByEmail = await Student.findOne({ email, institution: institutionId });
    if (existingStudentByEmail) {
      return res.status(400).json({ message: "Student ID Already Exists" });
    }

    // Check if studentId already exists (optionally scoped to institution)
    const existingStudentById = await Student.findOne({ studentId });
    if (existingStudentById) {
      return res.status(400).json({ message: "Student Email Already Exists" });
    }

    // Set lastName as the default password
    const plainPassword = lastName.trim().toUpperCase();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the new student
    const newStudent = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      course,
      year,
      section,
      password: hashedPassword,
      institution: institution._id,
    });

    // Populate institution details
    const savedStudent = await Student.findById(newStudent._id).populate(
      "institution",
      "institutionName"
    );

    // Send login details to student's email
    await sendStudentWelcomeEmail(
      savedStudent.email,
      savedStudent.firstName,
      savedStudent.lastName,
      plainPassword, // Send lastName as their temporary password
      savedStudent.institution.institutionName
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: {
        ...savedStudent._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    // Ensure institutionId is available from authentication middleware
    if (!req.institutionId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Institution ID missing.",
      });
    }

    // Fetch students that belong to the authenticated institution
    const students = await Student.find({
      institution: req.institutionId,
    }).populate("institution", "institutionName");

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "institution",
      "institutionName"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { currentPassword, password: newPassword, ...otherFields } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password if provided
    if (newPassword) {
      otherFields.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      otherFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error in updateStudent:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Cascade delete student from institution
    await Course.updateMany({ studentsEnrolled: studentId }, { $pull: { studentsEnrolled: studentId } });

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  const { email } = req.body;
  try {
    const student = await Student.findOne({ email }).populate(
      "institution",
      "institutionName"
    );
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      student.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    studentTokenAndCookie(res, student._id);

    student.lastLogin = new Date();
    await student.save();

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      student: {
        ...student._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in Login Function", error);
    res.status(400).json({
      success: false,
      message: "Error Logging in Student",
    });
  }
};

export const logoutStudent = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const studentForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    // Generate reset token

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    student.resetPasswordToken = resetToken;
    student.resetPasswordExpiresAt = resetTokenExpiresAt;

    await student.save();

    try {
      await student.save();
      console.log(
        "Reset token saved to DB:",
        student.resetPasswordToken,
        "Expires at:",
        student.resetPasswordExpiresAt
      );
    } catch (error) {
      console.error("Error saving reset token:", error);
    }

    // send reset password email

    await sendPasswordResetEmail(
      student.email,
      `${process.env.CLIENT_URL}/student/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.log("Error sending password reset email", error);
    res.status(400).json({
      success: false,
      message: "Error sending password reset email",
    });
  }
};

export const studentRestPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Session Expired. Please request a new password reset link",
      });
    }

    // update password

    const hashedPassword = await bcrypt.hash(password, 10);
    student.password = hashedPassword;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpiresAt = undefined;

    await student.save();

    // send reset success email

    await sendResetSuccessEmail(student.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error resetting password", error);
    res.status(400).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

export const studentCheckAuth = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId)
      .select("-password")
      .populate("institution", "institutionName");

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.log("Error checking student authentication", error);
    res.status(400).json({
      success: false,
      message: "Error checking student authentication",
    });
  }
};

// Google Login Route
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase Token
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;

    // Check if student exists in database
    let student = await Student.findOne({ email });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Your email is not registered in the system.",
      });
    }

    // If student exists, generate login token
    studentTokenAndCookie(res, student._id);

    // Exclude password from response
    const { password, ...studentWithoutPassword } = student._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({
      success: false,
      message: error.message.includes("auth/id-token-expired")
        ? "Google session expired. Please sign in again."
        : "Invalid Google authentication",
    });
  }
};
