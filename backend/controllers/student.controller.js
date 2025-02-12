import { Student } from "../models/student.model.js";
import { Institution } from "../models/institution.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendStudentWelcomeEmail,
} from "../mailtrap/emails.js";
import { studentTokenAndCookie } from "../utils/studentTokenAndCookie.js";
import admin from "../utils/firebaseStudent.js"; // Import Firebase without reinitializing


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

    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Set lastName as the default password
    const plainPassword = lastName.trim();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

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
    const students = await Student.find().populate(
      "institution",
      "institutionName"
    );
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
    const {
      studentId,
      firstName,
      lastName,
      email,
      course,
      year,
      section,
      password,
    } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId,
        firstName,
        lastName,
        email,
        course,
        year,
        section,
        password,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

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
    const student = await Student.findOne({ email });
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
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // ✅ Expire the cookie immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });
  
    res.status(200).json({ status: "success", message: "Logged out successfully" });
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
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Session Expired. Please request a new password reset link"
            })
        }   

        // update password

        const hashedPassword = await bcrypt.hash(password, 10);
        student.password= hashedPassword;
        student.resetPasswordToken = undefined;
        student.resetPasswordExpiresAt = undefined;

        await student.save();

        // send reset success email

        await sendResetSuccessEmail(student.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })


    } catch (error) {
        console.log("Error resetting password", error);
        res.status(400).json({
            success: false,
            message: "Error resetting password"
        })
    }
}

export const studentCheckAuth = async (req,res) => {
    try {
        const student = await Student.findById(req.studentId).select("-password");
        if(!student){
            return res.status(400).json({
                success: false,
                message: "Student not found"
            })
        }

        res.status(200).json({
            success: true,
            student
        })
    } catch (error) {
        console.log("Error checking student authentication", error);
        res.status(400).json({
            success: false,
            message: "Error checking student authentication"
        })
    }
}

  // Google Login Route
  export const googleLogin = async (req, res) => {
    try {
      const { token } = req.body;
  
      // Verify Firebase Token
      const decoded = await admin.auth().verifyIdToken(token);
      const email = decoded.email;
  
      console.log("Google Login Attempt:", email);
  
      // Check if student exists in database
      let student = await Student.findOne({ email });
  
      if (!student) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Your email is not registered in the system."
        });
      }
  
      // If student exists, generate login token
      studentTokenAndCookie(res, student._id);
  
      // Exclude password from response
      const { password, ...studentWithoutPassword } = student._doc;
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        student: studentWithoutPassword
      });
  
    } catch (error) {
      console.error("Google Login Error:", error);
      res.status(401).json({
        success: false,
        message: error.message.includes("auth/id-token-expired")
          ? "Google session expired. Please sign in again."
          : "Invalid Google authentication"
      });
    }
  };
  