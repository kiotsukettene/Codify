import mongoose from "mongoose";
import generateLessonSlug from "../utils/sluggifyLesson.js";

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    subTitle: { type: String },
    sections: [
      {
        subTitle: { type: String, required: true },
        description: { type: String },
        codeSnippets: [{ type: String }],
        notes: [{ type: String }],
      },
    ],
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LessonSchema.pre("save", generateLessonSlug);

export default mongoose.model("Lesson", LessonSchema);
