import mongoose from "mongoose";
import crypto from "crypto";
import { generateCourseCode } from "../utils/generateCourseCode.js";

const CourseSchema = new mongoose.Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    className: { type: String, required: true },
    program: { type: String, required: true },
    section: { type: String, required: true },
    language: { type: String, required: true },
    schedule: {
      day: { type: String, required: true },
      time: { type: String, required: true },
    },
    courseCode: {
      type: String,
      unique: true,
      default: generateCourseCode, // Generate course code on creation
    },
    studentsEnrolled: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
