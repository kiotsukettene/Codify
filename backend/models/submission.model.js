// models/submission.model.js
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
      ref: "Student", // Adjust to your student model
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "pending"],
      default: "pending",
    },
    file: {
      type: String, // Path to submitted file
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
