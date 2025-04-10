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
    className: { type: String, required: true },
    description: { type: String, required: true },
    program: { type: String, required: true },
    year: { type: String, required: true }, // Separate field for year
    section: { type: String, required: true }, // Separate field for section letter
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
