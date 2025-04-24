import Battle from "../models/battle.model.js";
import Course from "../models/course.model.js";

const sendBattleNotification = async (req, players, battle) => {
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");

  const notification = {
    type: "challenge",
    title: battle.status === "lobby" ? "Battle Ready in Lobby!" : battle.status === "active" ? "New Battle Challenge!" : "Upcoming Battle",
    message: `You've been selected for ${battle.status === "lobby" ? "a battle in lobby" : battle.status === "active" ? "an immediate" : "an upcoming"} code battle: ${battle.title}`,
    time: new Date().toISOString(),
    battleCode: battle.battleCode,
  };

  // Store notifications in the battle document
  const notifications = players.map((playerId) => ({
    playerId,
    ...notification,
    read: false,
  }));

  await Battle.updateOne(
    { battleCode: battle.battleCode },
    { $push: { notifications: { $each: notifications } } }
  );

  // Send notifications to connected players
  players.forEach((playerId) => {
    const socketId = connectedUsers.get(playerId.toString());
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
    const { battleCode } = req.params;
    const studentId = req.studentId;

    const battle = await Battle.findOne({ battleCode })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const isParticipant = [battle.player1._id.toString(), battle.player2._id.toString()].includes(studentId);
    if (!isParticipant) {
      return res.status(403).json({ message: "You are not a participant in this battle" });
    }

    const transformedChallenges = battle.challenges.map((challenge, index) => {
      const transformedTestCases = challenge.inputConstraints.map((input, i) => {
        const args = input.trim().split(/\s+/).map(Number);
        return {
          id: i + 1,
          input: JSON.stringify(args),
          expectedOutput: challenge.expectedOutput[i],
          status: "waiting",
        };
      });

      return {
        id: index + 1,
        title: challenge.problemTitle,
        points: challenge.points,
        timeLimit: 1800,
        description: challenge.problemDescription,
        examples: [],
        hints: [],
        testCases: transformedTestCases,
        functionName: challenge.functionName,
        numArguments: challenge.numArguments,
      };
    });

    const formattedBattle = {
      battleCode: battle.battleCode,
      title: battle.title,
      description: battle.description,
      duration: battle.duration,
      commencement: battle.commencement,
      status: battle.status,
      challenges: transformedChallenges,
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
        section: battle.courseId.section,
      },
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

    // Validate functionName and numArguments
    if (
      challenges.some(
        (challenge) =>
          !challenge.functionName ||
          challenge.functionName.trim() === "" ||
          !Number.isInteger(challenge.numArguments) ||
          challenge.numArguments < 1
      )
    ) {
      return res.status(400).json({
        message: "Each challenge must have a valid function name and number of arguments (at least 1)",
      });
    }

    // Validate input constraints match numArguments
    for (const challenge of challenges) {
      for (const input of challenge.inputConstraints) {
        const args = input.trim().split(/\s+/);
        if (args.length !== challenge.numArguments) {
          return res.status(400).json({
            message: `Input constraints must have exactly ${challenge.numArguments} argument(s)`,
          });
        }
      }
    }

    if (player1 === player2) {
      return res.status(400).json({ message: "Player 1 and Player 2 must be different students" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.studentsEnrolled.includes(player1) || !course.studentsEnrolled.includes(player2)) {
      return res.status(400).json({ message: "Selected players must be enrolled in the course" });
    }

    if (course.program !== program || course.section !== section) {
      return res.status(400).json({ message: "Program or section does not match the course" });
    }

    let finalCommencement = new Date(commencement);
    if (status === "pending" && finalCommencement <= new Date()) {
      return res.status(400).json({ message: "Commencement date must be in the future for scheduled battles" });
    }

    if (status === "lobby") {
      finalCommencement = new Date();
    }

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

export const getBattleByIdForProfessor = async (req, res) => {
  try {
    const { battleCode } = req.params;
    const professorId = req.professorId;

    const battle = await Battle.findOne({ battleCode, createdBy: professorId })
      .populate("player1", "firstName lastName _id")
      .populate("player2", "firstName lastName _id")
      .populate("courseId", "className program section");

    if (!battle) {
      return res.status(404).json({ message: "Battle not found or not authorized" });
    }

    const formattedBattle = {
      battleCode: battle.battleCode,
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
        section: battle.courseId.section,
      },
    };

    res.status(200).json(formattedBattle);
  } catch (error) {
    console.error("Error in getBattleByIdForProfessor:", error);
    res.status(500).json({
      message: "Error fetching battle",
      error: error.message,
    });
  }
};

export const joinBattle = async (req, res) => {
  try {
    const { battleCode } = req.params;
    const studentId = req.studentId;

    console.log("Join battle attempt:", { battleCode, studentId });

    const battle = await Battle.findOne({ battleCode });
    if (!battle) {
      console.log("Battle not found:", battleCode);
      return res.status(404).json({ message: "Battle not found" });
    }

    // Check if the student is a participant
    const isParticipant = [battle.player1.toString(), battle.player2.toString()].includes(studentId);
    if (!isParticipant) {
      console.log("Student not authorized for battle:", { battleCode, studentId });
      return res.status(403).json({ message: "You are not authorized to join this battle" });
    }

    // Check if the student has already joined
    if (battle.joinedPlayers.includes(studentId)) {
      console.log("Student already joined:", { battleCode, studentId });
      return res.status(200).json({ message: "You have already joined this battle" });
    }

    // Check battle status for new joins
    if (battle.status !== "pending") {
      console.log("Battle not joinable:", { battleCode, status: battle.status });
      // If the student is a participant, allow them to proceed to the lobby
      if (isParticipant) {
        return res.status(200).json({ message: "Successfully join!" });
      }
      return res.status(400).json({ message: "Battle is not accepting players" });
    }

    // Check if the battle is full
    if (battle.joinedPlayers.length >= 2) {
      console.log("Battle is full:", battleCode);
      return res.status(400).json({ message: "Battle is already full" });
    }

    // Join the battle
    battle.joinedPlayers.push(studentId);
    await battle.save();

    const socketRoom = req.app.get("io").to(battleCode);
    socketRoom.emit("playerJoined", { battleCode, studentId });

    if (battle.joinedPlayers.length === 2) {
      socketRoom.emit("opponentJoined", { battleCode, studentId });
    }

    console.log("Join successful:", { battleCode, studentId });
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
        id: battle.battleCode,
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
        battleCode: battle.battleCode,
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

export const markNotificationAsRead = async (req, res) => {
  try {
    const { battleCode, notificationId } = req.params;
    const studentId = req.studentId;

    const battle = await Battle.findOne({ battleCode });
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // Ensure the student is a participant
    if (![battle.player1.toString(), battle.player2.toString()].includes(studentId)) {
      return res.status(403).json({ message: "You are not authorized to modify this notification" });
    }

    // Update the notification
    const notification = battle.notifications.find(n => n._id.toString() === notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await battle.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
};

export const updateBattleStatus = async (req, res) => {
  try {
    const { battleCode } = req.params;
    const { status } = req.body;
    const professorId = req.professorId;

    // Validate status
    if (!["pending", "lobby", "active", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid battle status" });
    }

    const battle = await Battle.findOneAndUpdate(
      { battleCode, createdBy: professorId },
      { $set: { status } },
      { new: true }
    );

    if (!battle) {
      return res.status(404).json({ message: "Battle not found or not authorized" });
    }

    res.status(200).json({ message: "Battle status updated successfully", battle });
  } catch (error) {
    console.error("Error in updateBattleStatus:", error);
    res.status(500).json({
      message: "Error updating battle status",
      error: error.message,
    });
  }
};