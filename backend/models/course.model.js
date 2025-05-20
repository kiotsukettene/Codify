import mongoose from "mongoose";
import { generateCourseCode } from "../utils/generateCourseCode.js";
import generateCourseSlug from "../utils/sluggifyCourse.js";

const CourseSchema = new mongoose.Schema(
  {
        institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    className: { type: String, required: true },
    description: { type: String, required: true },
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
    slug: { type: String, unique: true, required: true },
    studentsEnrolled: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
      default: [],
    },
  },
  { timestamps: true }
);

CourseSchema.virtual("studentCount").get(function () {
  return this.studentsEnrolled.length;
});

// Define a virtual field to count lessons related to this course
CourseSchema.virtual("lessonCount", {
  ref: "Lesson", // The model to use
  localField: "_id", // Find courses where `_id`
  foreignField: "courseId", // is equal to the Lesson's `courseId`
  count: true, // And only return the count of documents
});

CourseSchema.pre("save", generateCourseSlug); // Generate slug on save
CourseSchema.set("toObject", { virtuals: true });
CourseSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Course", CourseSchema);