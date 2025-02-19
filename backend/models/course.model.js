import mongoose from "mongoose";

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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
