import Lesson from "../models/lesson.model.js";
import mongoose from "mongoose";
import slugify from "slugify";

export const createLesson = async (req, res) => {
  try {
    const { courseId, title, subTitle, sections } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const lesson = new Lesson({
      courseId,
      title,
      subTitle,
      sections,
      slug,
    });

    await lesson.save();

    res.status(201).json({
      message: "Lesson created successfully!",
      lesson,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating lesson", error: error.message });
  }
};

export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    const lessons = await Lesson.find({ courseId });

    res.status(200).json(lessons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lessons", error: error.message });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lesson", error: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
    });

    if (!updatedLesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json({
      message: "Lesson updated successfully!",
      updatedLesson,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating lesson", error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    if (!deletedLesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json({ message: "Lesson deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lesson", error: error.message });
  }
};
