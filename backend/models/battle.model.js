import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
  problemTitle: { type: String, required: true },
  problemDescription: { type: String, required: true },
  inputConstraints: [{ type: String }], // Changed to array of strings
  expectedOutput: [{ type: String }], // Changed to array of strings
});

const BattleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    commencement: { type: Date, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    program: { type: String, required: true },
    section: { type: String, required: true },
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    challenges: [ChallengeSchema],
    rules: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
  },
  { timestamps: true }
);

const Battle = mongoose.model("Battle", BattleSchema);
export default Battle;