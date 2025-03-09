import mongoose from "mongoose";
import generateActivitySlug from "../utils/sluggifyActivity.js";

const ActivitySchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson", // ✅ Reference to the Lesson model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    instructions: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    points: {
      type: Number,
      default: 100,
    },
    file: {
      type: String, // ✅ Store the file path
    },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);

ActivitySchema.pre("save", generateActivitySlug); // Generate slug on save

export default Activity;
