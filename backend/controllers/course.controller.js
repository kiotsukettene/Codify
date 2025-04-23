import Course from "../models/course.model.js";
import { generateCourseCode } from "../utils/generateCourseCode.js";
import slugify from "slugify";

export const createCourse = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Institution ID from token:", req.institutionId);

    const {
      className,
      description,
      program,
      year,
      section,
      professorId,
      language,
      schedule,
    } = req.body;

    const institutionId = req.institutionId;
    if (
      !institutionId ||
      !className ||
      !description ||
      !program ||
      !year ||
      !section ||
      !professorId ||
      !language ||
      !schedule ||
      !schedule.day ||
      !schedule.time
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let courseCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    while (!isUnique && attempts < maxAttempts) {
      courseCode = generateCourseCode();
      console.log("Generated courseCode:", courseCode);
      const existingCourse = await Course.findOne({ courseCode });
      if (!existingCourse) isUnique = true;
      attempts++;
    }
    if (!isUnique) {
      return res
        .status(500)
        .json({ message: "Failed to generate unique course code" });
    }

    const slug = slugify(String(className), { lower: true, strict: true });
    console.log("Generated slug:", slug);

    const course = new Course({
      institutionId,
      className,
      description,
      program,
      year,
      section,
      professorId,
      language,
      schedule,
      courseCode,
      slug,
    });

    console.log("Course object before save:", course);
    await course.save();

    res.status(201).json({
      message: "Course created successfully!",
      courseCode: course.courseCode,
      course,
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

export const getCoursesByInstitution = async (req, res) => {
  try {
    const institutionId = req.institutionId;
    console.log("Fetching courses for institutionId:", institutionId); // Debug log
    const courses = await Course.find({ institutionId })
      .populate({
        path: "studentsEnrolled",
        select: "firstName lastName _id",
      })
      .select("className program section studentsEnrolled _id courseCode");
    // console.log("Fetched courses:", courses); // Debug log
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error in getCoursesByInstitution:", error);
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

export const getCoursesByProfessor = async (req, res) => {
  try {
    const professorId = req.professorId; // Extracted from JWT via profVerifyToken

    const courses = await Course.find({ professorId })
      .populate({
        path: "studentsEnrolled",
        select: "firstName lastName _id",
      })
      .select("className program section studentsEnrolled _id courseCode slug language");

    // console.log("Fetched courses:", courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error in getCoursesByProfessor:", error);
    res.status(500).json({
      message: "Error fetching professor courses",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("Fetching course with ID:", courseId); // Debug log
    const course = await Course.findById(courseId)
      .populate({
        path: "professorId",
        select: "firstName lastName email",
      })
      .populate({
        path: "studentsEnrolled",
        select: "firstName lastName email studentId",
      });

    if (!course) return res.status(404).json({ message: "Course not found" });

    console.log("Course Data:", course);
    console.log("Professor Data:", course.professorId);
    console.log("Students Enrolled:", course.studentsEnrolled);

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
    console.log("Updating course with ID:", courseId); // Debug log
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
    console.error("Error in updateCourse:", error);
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("Deleting course with ID:", courseId); // Debug log
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};