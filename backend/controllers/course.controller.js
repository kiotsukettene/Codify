import Course from "../models/course.model.js";
import { generateCourseCode } from "../utils/generateCourseCode.js";

export const createCourse = async (req, res) => {
  try {
    const { professorId, className, program, section, language, schedule } =
      req.body;

    // Generate a unique course code
    let courseCode;
    let isUnique = false;

    // Ensure courseCode is unique in the database
    while (!isUnique) {
      courseCode = generateCourseCode();
      const existingCourse = await Course.findOne({ courseCode });
      if (!existingCourse) isUnique = true; // Only break loop if the code is unique
    }

    const course = new Course({
      professorId,
      className,
      program,
      section,
      language,
      schedule,
      courseCode, // ✅ Add generated course code
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully!",
      courseCode: course.courseCode, // Send generated course code
      course,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

export const getCoursesByProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    const courses = await Course.find({ professorId });

    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("professorId", "firstName lastName") // ✅ Populate professor's name
      .exec();

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
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
