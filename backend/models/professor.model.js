import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: false,
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
    role: {
      type: String,
      enum: ["professor"],
      default: "professor",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

professorSchema.virtual("courseCount", {
  ref: "Course",
  localField: "_id",
  foreignField: "professorId",
  count: true,
});

// Ensure virtuals are included in toJSON and toObject
professorSchema.set("toJSON", { virtuals: true });
professorSchema.set("toObject", { virtuals: true });

// Unique index for email and institution combination
professorSchema.index({ email: 1, institution: 1 }, { unique: true });

export const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);
