import Battle from "../models/battle.model.js";
import Course from "../models/course.model.js";

const sendBattleNotification = async (req, players, battle) => {
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");

  console.log("Sending notifications to players:", players, "Connected Users:", [...connectedUsers]);

  const notification = {
    type: "challenge",
    title: battle.status === "active" ? "New Battle Challenge!" : "Upcoming Battle",
    message: `You've been selected for ${battle.status === "active" ? "an immediate" : "an upcoming"} code battle: ${battle.title}`,
    time: "Just now",
    battleId: battle.battleId,
  };

  players.forEach((playerId) => {
    const socketId = connectedUsers.get(playerId.toString());
    console.log(`Sending notification to player ${playerId}, socket ${socketId}`);
    if (socketId) {
      io.to(socketId).emit("battleNotification", notification);
      console.log(`Notification sent to player ${playerId}`);
    } else {
      console.warn(`Player ${playerId} is not connected`);
    }
  });
};

export const getBattleById = async (req, res) => {
  try {
    const { battleId } = req.params;
    const studentId = req.studentId;

    const battle = await Battle.findOne({ battleId })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // Ensure the student is a participant
    if (![battle.player1._id.toString(), battle.player2._id.toString()].includes(studentId)) {
      return res.status(403).json({ message: "You are not a participant in this battle" });
    }

    // Format the response data
    const formattedBattle = {
      battleId: battle.battleId,
      title: battle.title,
      description: battle.description,
      duration: battle.duration,
      commencement: battle.commencement,
      status: battle.status,
      challenges: battle.challenges,
      joinedPlayers: battle.joinedPlayers || [],
      player1: {
        id: battle.player1._id,
        name: `${battle.player1.firstName} ${battle.player1.lastName}`,
      },
      player2: {
        id: battle.player2._id,
        name: `${battle.player2.firstName} ${battle.player2.lastName}`,
      },
      course: {
        id: battle.courseId._id,
        name: battle.courseId.className,
        program: battle.courseId.program,
        section: battle.courseId.section
      }
    };

    res.status(200).json(formattedBattle);
  } catch (error) {
    console.error("Error in getBattleById:", error);
    res.status(500).json({
      message: "Error fetching battle",
      error: error.message,
    });
  }
};

export const createBattle = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      commencement,
      courseId,
      program,
      section,
      player1,
      player2,
      challenges,
      rules,
      status = "pending",
    } = req.body;

    const professorId = req.professorId;

    // Validate required fields
    if (
      !title ||
      !description ||
      !duration ||
      !commencement ||
      !courseId ||
      !program ||
      !section ||
      !player1 ||
      !player2 ||
      !challenges ||
      challenges.length === 0
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate challenges
    if (
      challenges.some(
        (challenge) =>
          !Array.isArray(challenge.inputConstraints) ||
          !Array.isArray(challenge.expectedOutput) ||
          challenge.inputConstraints.length !== 3 ||
          challenge.expectedOutput.length !== 3 ||
          challenge.inputConstraints.some((tc) => typeof tc !== "string" || tc.trim() === "") ||
          challenge.expectedOutput.some((tc) => typeof tc !== "string" || tc.trim() === "")
      )
    ) {
      return res.status(400).json({
        message: "Each challenge must have exactly 3 non-empty string input constraints and expected outputs",
      });
    }

    // Verify that player1 and player2 are different
    if (player1 === player2) {
      return res.status(400).json({ message: "Player 1 and Player 2 must be different students" });
    }

    // Verify that the course exists and players are enrolled
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.studentsEnrolled.includes(player1) || !course.studentsEnrolled.includes(player2)) {
      return res.status(400).json({ message: "Selected players must be enrolled in the course" });
    }

    // Verify program and section match the course
    if (course.program !== program || course.section !== section) {
      return res.status(400).json({ message: "Program or section does not match the course" });
    }

    // Validate commencement date for pending battles
    let finalCommencement = new Date(commencement);
    if (status === "pending" && finalCommencement <= new Date()) {
      return res.status(400).json({ message: "Commencement date must be in the future for scheduled battles" });
    }

    // For immediate battles, set commencement to now
    if (status === "active") {
      finalCommencement = new Date();
    }

    // Create the battle
    const battle = new Battle({
      title,
      description,
      duration,
      commencement: finalCommencement,
      courseId,
      program,
      section,
      player1,
      player2,
      challenges,
      rules,
      createdBy: professorId,
      status,
    });

    await battle.save();

    // Send notifications to selected players
    await sendBattleNotification(req, [player1, player2], battle);

    res.status(201).json({
      message: status === "active" ? "Battle commenced successfully!" : "Battle scheduled successfully!",
      battle,
    });
  } catch (error) {
    console.error("Error in createBattle:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      message: "Error creating battle",
      error: error.message,
    });
  }
};

export const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    const studentId = req.studentId;

    console.log("Join battle attempt:", { battleId, studentId });

    const battle = await Battle.findOne({ battleId });
    if (!battle) {
      console.log("Battle not found:", battleId);
      return res.status(404).json({ message: "Battle not found" });
    }

    // Check if the student is a participant
    const isParticipant = [battle.player1.toString(), battle.player2.toString()].includes(studentId);
    if (!isParticipant) {
      console.log("Student not authorized for battle:", { battleId, studentId });
      return res.status(403).json({ message: "You are not authorized to join this battle" });
    }

    // Check if the student has already joined
    if (battle.joinedPlayers.includes(studentId)) {
      console.log("Student already joined:", { battleId, studentId });
      return res.status(200).json({ message: "You have already joined this battle" });
    }

    // Check battle status for new joins
    if (battle.status !== "pending") {
      console.log("Battle not joinable:", { battleId, status: battle.status });
      // If the student is a participant, allow them to proceed to the lobby
      if (isParticipant) {
        return res.status(200).json({ message: "Successfully join!" });
      }
      return res.status(400).json({ message: "Battle is not accepting players" });
    }

    // Check if the battle is full
    if (battle.joinedPlayers.length >= 2) {
      console.log("Battle is full:", battleId);
      return res.status(400).json({ message: "Battle is already full" });
    }

    // Join the battle
    battle.joinedPlayers.push(studentId);
    await battle.save();

    const socketRoom = io.to(battleId);
    socketRoom.emit("playerJoined", { battleId, studentId });

    if (battle.joinedPlayers.length === 2) {
      socketRoom.emit("opponentJoined", { battleId, studentId });
    }

    console.log("Join successful:", { battleId, studentId });
    res.status(200).json({ message: "Joined battle successfully" });
  } catch (error) {
    console.error("Error joining battle:", error);
    res.status(500).json({ message: "Error joining battle", error: error.message });
  }
};

export const getStudentBattles = async (req, res) => {
  try {
    const studentId = req.studentId;

    const battles = await Battle.find({
      $or: [{ player1: studentId }, { player2: studentId }],
    })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    const formattedBattles = battles.map((battle) => {
      const progress1 = battle.results?.player1Score
        ? Math.round((battle.results.player1Score / battle.totalPoints) * 100)
        : 0;
      const progress2 = battle.results?.player2Score
        ? Math.round((battle.results.player2Score / battle.totalPoints) * 100)
        : 0;

      return {
        id: battle.battleId,
        challenge: battle.title,
        description: `${battle.courseId.className} | ${battle.courseId.program} ${battle.courseId.section} | ${battle.duration} minutes`,
        time: new Date(battle.commencement).toLocaleString(),
        challengers: [
          {
            id: battle.player1._id,
            name: `${battle.player1.firstName} ${battle.player1.lastName}`,
            progress: progress1,
          },
          {
            id: battle.player2._id,
            name: `${battle.player2.firstName} ${battle.player2.lastName}`,
            progress: progress2,
          },
        ],
        course: {
          id: battle.courseId._id,
          name: battle.courseId.className,
          program: battle.courseId.program,
          section: battle.courseId.section,
        },
        status: battle.status,
        commencement: battle.commencement,
      };
    });

    res.status(200).json(formattedBattles);
  } catch (error) {
    console.error("Error in getStudentBattles:", error);
    res.status(500).json({
      message: "Error fetching battles",
      error: error.message,
    });
  }
};

export const getCoursesForBattle = async (req, res) => {
  try {
    const professorId = req.professorId;

    // Fetch courses for the professor, including enrolled students
    const courses = await Course.find({ professorId })
      .populate({
        path: "studentsEnrolled",
        select: "firstName lastName _id",
      })
      .select("className program section studentsEnrolled _id");

    // Format the response to include course details and enrolled students
    const formattedCourses = courses.map((course) => ({
      id: course._id,
      name: course.className,
      program: course.program,
      section: course.section,
      students: course.studentsEnrolled.map((student) => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
      })),
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error("Error in getCoursesForBattle:", error);
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

export const getBattlesByProfessor = async (req, res) => {
  try {
    const professorId = req.professorId;

    const battles = await Battle.find({ createdBy: professorId })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    const formattedBattles = battles.map((battle) => {
      const progress1 = battle.results?.player1Score
        ? Math.round((battle.results.player1Score / battle.totalPoints) * 100)
        : 0;
      const progress2 = battle.results?.player2Score
        ? Math.round((battle.results.player2Score / battle.totalPoints) * 100)
        : 0;

      return {
        id: battle._id,
        challenge: battle.title,
        description: `${battle.courseId.className} | ${battle.courseId.program} ${battle.courseId.section} | ${battle.duration} minutes`,
        time: new Date(battle.commencement).toLocaleString(),
        challengers: [
          { 
            id: battle.player1._id,
            name: `${battle.player1.firstName} ${battle.player1.lastName}`, 
            progress: progress1 
          },
          { 
            id: battle.player2._id,
            name: `${battle.player2.firstName} ${battle.player2.lastName}`, 
            progress: progress2 
          },
        ],
        course: {
          id: battle.courseId._id,
          name: battle.courseId.className,
          program: battle.courseId.program,
          section: battle.courseId.section,
        },
        status: battle.status,
        commencement: battle.commencement,
        challenges: battle.challenges,
        rules: battle.rules,
        duration: battle.duration
      };
    });

    res.status(200).json(formattedBattles);
  } catch (error) {
    console.error("Error in getBattlesByProfessor:", error);
    res.status(500).json({
      message: "Error fetching battles",
      error: error.message,
    });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const professorId = req.professorId;

    const battles = await Battle.find({ createdBy: professorId })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id");

    // Fetch courses to get section information
    const courses = await Course.find({ professorId }).select("studentsEnrolled program section");

    // Map student IDs to their section
    const studentSections = {};
    courses.forEach((course) => {
      course.studentsEnrolled.forEach((studentId) => {
        studentSections[studentId.toString()] = `${course.program} ${course.section}`;
      });
    });

    // Aggregate scores
    const studentScores = {};
    battles.forEach((battle) => {
      if (battle.results) {
        const player1Id = battle.player1._id.toString();
        const player2Id = battle.player2._id.toString();

        if (!studentScores[player1Id]) {
          studentScores[player1Id] = {
            id: player1Id,
            name: `${battle.player1.firstName} ${battle.player1.lastName}`,
            section: studentSections[player1Id] || "Unknown",
            totalPoints: 0,
            battlesPlayed: 0,
          };
        }
        if (!studentScores[player2Id]) {
          studentScores[player2Id] = {
            id: player2Id,
            name: `${battle.player2.firstName} ${battle.player2.lastName}`,
            section: studentSections[player2Id] || "Unknown",
            totalPoints: 0,
            battlesPlayed: 0,
          };
        }

        studentScores[player1Id].totalPoints += battle.results.player1Score || 0;
        studentScores[player1Id].battlesPlayed += 1;
        studentScores[player2Id].totalPoints += battle.results.player2Score || 0;
        studentScores[player2Id].battlesPlayed += 1;
      }
    });

    const leaderboard = Object.values(studentScores)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({
        ...entry,
        id: index + 1,
      }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    res.status(500).json({
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

export const deleteBattle = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.professorId;

    const battle = await Battle.findOneAndDelete({
      _id: id,
      createdBy: professorId,
    });

    if (!battle) {
      return res.status(404).json({ message: "Battle not found or not authorized" });
    }

    res.status(200).json({ message: "Battle deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBattle:", error);
    res.status(500).json({
      message: "Error deleting battle",
      error: error.message,
    });
  }
};

export const updateBattle = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.professorId;
    const updates = req.body;

    // Prevent updating results or status directly
    delete updates.results;
    delete updates.status;

    const battle = await Battle.findOneAndUpdate(
      { _id: id, createdBy: professorId },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    if (!battle) {
      return res.status(404).json({ message: "Battle not found or not authorized" });
    }

    const formattedBattle = {
      id: battle._id,
      challenge: battle.title,
      description: `${battle.courseId.className} | ${battle.courseId.program} ${battle.courseId.section} | ${battle.duration} minutes`,
      time: new Date(battle.commencement).toLocaleString(),
      challengers: [
        { name: `${battle.player1.firstName} ${battle.player1.lastName}`, progress: 0 },
        { name: `${battle.player2.firstName} ${battle.player2.lastName}`, progress: 0 },
      ],
      course: {
        id: battle.courseId._id,
        name: battle.courseId.className,
        program: battle.courseId.program,
        section: battle.courseId.section,
      },
      status: battle.status,
      commencement: battle.commencement,
      createdAt: battle.createdAt,
    };

    res.status(200).json(formattedBattle);
  } catch (error) {
    console.error("Error in updateBattle:", error);
    res.status(500).json({
      message: "Error updating battle",
      error: error.message,
    });
  }
};