import mongoose from "mongoose";
import generateActivitySlug from "../utils/sluggifyActivity.js";

const ActivitySchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
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
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// 1) Attach the hook before creating the model
ActivitySchema.pre("save", generateActivitySlug);

// 2) Create and export the model
const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
