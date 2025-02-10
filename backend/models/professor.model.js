import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true }, // Add this field for Google OAuth
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password should be optional for Google SSO users
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String }, // Store profile picture from Google
    lastLogin: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);
