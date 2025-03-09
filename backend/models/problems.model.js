import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    unique: true, // e.g., "1"
  },
  title: {
    type: String,
    required: true, // e.g., "Two Sum"
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  testCases: {
    nums: [[Number]], // e.g., [[2,7,11,15], [3,2,4], [3,3]]
    targets: [Number], // e.g., [9, 6, 6]
    answers: [[Number]], // e.g., [[0,1], [1,2], [0,1]]
  },
  starterCode: { // Keeping this from your local challenges
    javascript: String,
    java: String,
    csharp: String,
    python: String,
    c: String,
    cpp: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Problem = mongoose.model("Problem", problemSchema);