import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    resetPasswordToken: { type: String }, // Add inside the schema
    resetPasswordExpiresAt: { type: Date }, // Add inside the schema
  },
  { timestamps: true }
);

export const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);
