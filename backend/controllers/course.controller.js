import Course from "../models/course.model.js";
import { generateCourseCode } from "../utils/generateCourseCode.js";
import slugify from "slugify";

export const createCourse = async (req, res) => {
  try {
    // Destructure only the course data from the request body
    const { className, description, program, section, language, schedule } =
      req.body;

    // Get professorId from the token attached by the middleware
    const professorId = req.professorId;

    // Generate a unique course code
    let courseCode;
    let isUnique = false;
    while (!isUnique) {
      courseCode = generateCourseCode();
      const existingCourse = await Course.findOne({ courseCode });
      if (!existingCourse) isUnique = true;
    }

    const slug = slugify(className, { lower: true, strict: true });

    // Create new course with professorId from the token
    const course = new Course({
      professorId,
      className,
      description,
      program,
      section,
      language,
      schedule,
      courseCode,
      slug,
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully!",
      courseCode: course.courseCode,
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

// export const getCoursesByProfessor = async (req, res) => {
//   try {
//     const { professorId } = req.params;
//     const courses = await Course.find({ professorId });

//     res.status(200).json(courses);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching courses", error: error.message });
//   }
// };

export const getCoursesByProfessor = async (req, res) => {
  try {
    // Use professorId from the token (attached to req by profVerifyToken middleware)
    const professorId = req.professorId;
    const courses = await Course.find({ professorId }).populate("lessonCount");

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: "professorId",
      select: "firstName lastName email", // ✅ Select only necessary fields
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    console.log("Course Data:", course); // ✅ Debugging log
    console.log("Professor Data:", course.professorId); // ✅ Should contain firstName & lastName

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });

    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });

    res.status(200).json({
      message: "Course updated successfully!",
      updatedCourse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};
