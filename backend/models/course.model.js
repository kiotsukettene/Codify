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
    className: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "className",
    },
    description: { type: String, required: true },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseField",
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseField",
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseField",
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    language: { type: String, required: true },
    schedule: {
      day: { type: String, required: true },
      time: { type: String, required: true },
    },
    courseCode: {
      type: String,
      unique: true,
      default: generateCourseCode,
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

CourseSchema.virtual("lessonCount", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "courseId",
  count: true,
});

CourseSchema.pre("save", generateCourseSlug);
CourseSchema.set("toObject", { virtuals: true });
CourseSchema.set("toJSON", { virtuals: true });

const Course = mongoose.model("Course", CourseSchema);
export default Course;
