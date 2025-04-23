import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
  challengeId: { 
    type: String, 
    required: true,
    default: () => Math.random().toString(36).substr(2, 9)
  },
  problemTitle: { type: String, required: true },
  problemDescription: { 
    type: String, 
    required: true,
    content: String,
  },
  points: { type: Number, required: true, default: 100 },
  inputConstraints: [{ type: String }],
  expectedOutput: [{ type: String }],
});

const BattleSchema = new mongoose.Schema(
  {
    battleCode: {
      type: String,
      required: true,
      unique: true,
      default: () => Math.random().toString(36).substr(2, 9)
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    commencement: { type: Date, required: true },
    totalPoints: { type: Number, default: 0 },
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
    joinedPlayers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: []
    }],
    challenges: [ChallengeSchema],
    rules: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "lobby", "active", "completed"],
      default: "pending",
    },
    results: {
      player1Score: { type: Number, default: 0 },
      player2Score: { type: Number, default: 0 },
    },
    notifications: [{
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      type: { type: String, default: "challenge" },
      title: String,
      message: String,
      time: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
      battleCode: String,
    }],
  },
  { timestamps: true }
);

// Calculate total points before saving
BattleSchema.pre('save', function(next) {
  this.totalPoints = this.challenges.reduce((sum, challenge) => sum + challenge.points, 0);
  next();
});

const Battle = mongoose.model("Battle", BattleSchema);
export default Battle;