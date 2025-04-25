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
  functionName: { type: String, required: true }, // e.g., "sumTwoNumbers", "multiply", "factorial"
  numArguments: { type: Number, required: true }, // e.g., 2 for sumTwoNumbers, 1 for factorial
  playerProgress: [{
    playerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student" 
    },
    status: { 
      type: String, 
      enum: ["locked", "unlocked", "completed"],
      default: "locked"
    },
    code: { type: String },
    language: { type: String },
    submittedAt: { type: Date },
    score: { type: Number, default: 0 }
  }]
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
  
  // If this is a new battle, unlock the first challenge for both players
  if (this.isNew && this.challenges.length > 0) {
    const firstChallenge = this.challenges[0];
    
    // Unlock for player1
    if (!firstChallenge.playerProgress.some(p => p.playerId.toString() === this.player1.toString())) {
      firstChallenge.playerProgress.push({
        playerId: this.player1,
        status: "unlocked"
      });
    }
    
    // Unlock for player2
    if (!firstChallenge.playerProgress.some(p => p.playerId.toString() === this.player2.toString())) {
      firstChallenge.playerProgress.push({
        playerId: this.player2,
        status: "unlocked"
      });
    }
  }
  
  if (this.player1.toString() === this.player2.toString()) {
    next(new Error('Player 1 and Player 2 must be different'));
  }
  
  next();
});

// Add a method to update challenge progress
BattleSchema.methods.updateChallengeProgress = async function(challengeId, playerId, progressData) {
  const challenge = this.challenges.find(c => c.challengeId === challengeId);
  if (!challenge) return null;

  let progress = challenge.playerProgress.find(p => p.playerId.toString() === playerId.toString());
  
  if (!progress) {
    challenge.playerProgress.push({
      playerId,
      ...progressData
    });
  } else {
    Object.assign(progress, progressData);
  }

  await this.save();
  return challenge;
};

// Add a method to get player's battle progress
BattleSchema.methods.getPlayerProgress = function(playerId) {
  return this.challenges.map(challenge => {
    const progress = challenge.playerProgress.find(
      p => p.playerId.toString() === playerId.toString()
    ) || { status: "locked" };

    return {
      challengeId: challenge.challengeId,
      status: progress.status,
      code: progress.code,
      language: progress.language,
      score: progress.score,
      submittedAt: progress.submittedAt
    };
  });
};

// Add indexes for better query performance
BattleSchema.index({ courseId: 1, status: 1 });
BattleSchema.index({ player1: 1, status: 1 });
BattleSchema.index({ player2: 1, status: 1 });

// Add method to check if battle is active
BattleSchema.methods.isActive = function() {
  if (this.status !== 'active') return false;
  
  const now = new Date();
  const endTime = new Date(this.commencement.getTime() + this.duration * 60000);
  return now >= this.commencement && now <= endTime;
};

// Add method to get challenge by ID with player progress
BattleSchema.methods.getChallengeWithProgress = function(challengeId, playerId) {
  const challenge = this.challenges.find(c => c.challengeId === challengeId);
  if (!challenge) return null;

  const progress = challenge.playerProgress.find(
    p => p.playerId.toString() === playerId.toString()
  ) || { status: "locked" };

  return {
    ...challenge.toObject(),
    currentProgress: {
      status: progress.status,
      code: progress.code,
      language: progress.language,
      score: progress.score,
      submittedAt: progress.submittedAt
    }
  };
};

// Add method to check if player can access challenge
BattleSchema.methods.canAccessChallenge = function(challengeId, playerId) {
  const challengeIndex = this.challenges.findIndex(c => c.challengeId === challengeId);
  if (challengeIndex === -1) return false;

  // First challenge is always accessible
  if (challengeIndex === 0) return true;

  // Check if previous challenge is completed
  const prevChallenge = this.challenges[challengeIndex - 1];
  const prevProgress = prevChallenge.playerProgress.find(
    p => p.playerId.toString() === playerId.toString()
  );

  return prevProgress && prevProgress.status === 'completed';
};

const Battle = mongoose.model("Battle", BattleSchema);
export default Battle;