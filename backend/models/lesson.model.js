import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    sections: [
      {
        subTitle: { type: String, required: true },
        description: { type: String },
        codeSnippets: [{ type: String }],
        notes: [{ type: String }],
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);
