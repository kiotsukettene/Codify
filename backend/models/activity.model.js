import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
