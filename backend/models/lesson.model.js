import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true }, // Main lesson title
    sections: [
      {
        subTitle: { type: String, required: true }, // Sub-title for each section
        description: { type: String },
        codeSnippets: [{ type: String }], // Supports multiple code snippets
        notes: [{ type: String }], // Supports multiple notes per section
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);
