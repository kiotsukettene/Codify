import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true }, // Google OAuth ID
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google SSO users
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      default: "professor",
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: false,
    },
    lastLogin: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true }
);

professorSchema.virtual("courseCount", {
  ref: "Course",
  localField: "_id",
  foreignField: "professorId",
  count: true, // Return the number of courses
});

professorSchema.set("toObject", { virtuals: true });
professorSchema.set("toJSON", { virtuals: true });

export const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);
