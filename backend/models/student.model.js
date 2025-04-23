import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: "/src/assets/picture/Avatar/cat1.png", // Default avatar
    },
    solvedChallenges: [
      {
        id: String,
        title: String,
        difficulty: String,
        codeSubmitted: String,
      }
    ],
    events: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: false, 
        },
        priority: {
          type: String,
          required: true,
          enum: ["Low", "Medium", "High"],
        },
        allDay: {
          type: Boolean,
          default: false, 
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);
studentSchema.index({ email: 1, institution: 1 }, { unique: true });

studentSchema.index({"events.start": 1, "events.end": 1});
export const Student = mongoose.model("Student", studentSchema);