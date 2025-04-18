import Battle from "../models/battle.model.js";
import Course from "../models/course.model.js";

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
      challenges.some(challenge => 
        !Array.isArray(challenge.inputConstraints) ||
        !Array.isArray(challenge.expectedOutput) ||
        challenge.inputConstraints.length !== 3 ||
        challenge.expectedOutput.length !== 3 ||
        challenge.inputConstraints.some(tc => typeof tc !== 'string' || tc.trim() === '') ||
        challenge.expectedOutput.some(tc => typeof tc !== 'string' || tc.trim() === '')
      )
    ) {
      return res.status(400).json({ 
        message: "Each challenge must have exactly 3 non-empty string input constraints and expected outputs" 
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

    if (
      !course.studentsEnrolled.includes(player1) ||
      !course.studentsEnrolled.includes(player2)
    ) {
      return res.status(400).json({ message: "Selected players must be enrolled in the course" });
    }

    // Verify program and section match the course
    if (course.program !== program || course.section !== section) {
      return res.status(400).json({ message: "Program or section does not match the course" });
    }

    // Create the battle
    const battle = new Battle({
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
      createdBy: professorId,
    });

    await battle.save();

    res.status(201).json({
      message: "Battle created successfully!",
      battle,
    });
  } catch (error) {
    console.error("Error in createBattle:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    res.status(500).json({
      message: "Error creating battle",
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