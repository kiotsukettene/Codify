import Course from "../models/course.model.js"
import Lesson from "../models/lesson.model.js"
import Activity from "../models/activity.model.js"
import { Student } from "../models/student.model.js"

// Join a course using courseCode


export const joinCourse = async (req, res) => {
    try {
        const { courseCode } = req.body
        const studentId = req.studentId 

        if (!courseCode) {
            return res.status(400).json({
                message: "Course code is required"
            })
        }

        // Find the course by courseCode
        const course = await Course.findOne({ courseCode });

        if(!course) return res.status(404).json({
            message: "Course not found"
        })

        // Check if student is already enrolled
        if (course.studentsEnrolled.includes(studentId)) {
            return res.status(400).json({
                message: "You are already enrolled in this course"
            })
        }

        // Add student to the course

        course.studentsEnrolled.push(studentId)
        await course.save()

        res.status(200).json({
            message: "You have successfully joined the course!",
            course: {
                _id: course._id,
                className: course.className,
                courseCode: course.courseCode,
            }
        })
    } catch (error) {
        console.log("Error joining course: ", error);
        res.status(400).json({
            message: "Error joining course",
            error: error.message
        })
    }
}

// Fetch all courses the student is enrolled in

export const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.studentId;

        const courses = await Course.find({ studentsEnrolled: studentId }).populate({
            path: "professorId",
            select: "firstName lastName email"
        });

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching enrolled courses: ", error);  
        res.status(400).json({
            message: "Error fetching enrolled courses",
            error: error.message
        })
    }
}

// Fetch lessons for a specific course (only if student is enrolled)

export const getLessonsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.studentId;

        // Verify student is enrolled in the course
        const course = await Course.findById(courseId);
        if(!course) return res.status(404).json({
            message: "Course not found"
        })
        if(!course.studentsEnrolled.includes(studentId)) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            })
        }

        // Fetch lessons

        const lessons = await Lesson.find({ courseId });
        res.status(200).json(lessons);
    } catch (error) {
        console.error("Error fetching lessons: ", error);
        res.status(400).json({
            message: "Error fetching lessons",
            error: error.message
        })
    }
}

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.studentId;

    const course = await Course.findById(courseId).populate({
      path: "professorId",
      select: "firstName lastName",
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!course.studentsEnrolled.includes(studentId)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};