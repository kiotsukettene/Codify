import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "pending"],
      default: "pending",
    },
    file: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
