import { Student } from "../models/student.model.js";

export const getStudentSolvedChallenges = async (req, res) => {
  const { studentId, challengeId, challengeTitle, challengeDifficulty, challengeCodeSubmitted } = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check if the challenge is already solved
    const isAlreadySolved = student.solvedChallenges.some(
      (challenge) => challenge.id === challengeId
    );

    if (!isAlreadySolved) {
      student.solvedChallenges.push({
        id: challengeId,
        title: challengeTitle,
        difficulty: challengeDifficulty,
        codeSubmitted: challengeCodeSubmitted,
      });
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Challenge solved successfully",
      student,
    });
  } catch (error) {
    console.log("Error updating student solved challenges: ", error);
    res.status(400).json({
      message: "Error updating student solved challenges",
      error: error.message,
    });
  }
};

export const fetchSolvedProblems = async (req, res) => {
  const { studentId } = req.params; // Correctly access studentId from req.params

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({ solvedChallenges: student.solvedChallenges });
  } catch (error) {
    res.status(500).json({ message: "Error fetching solved challenges", error });
  }
};