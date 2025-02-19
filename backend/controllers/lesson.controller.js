import Lesson from "../models/lesson.model.js";

/**
 * @desc    Create a new lesson
 * @route   POST /api/lessons/create
 * @access  Private (Professor)
 */
export const createLesson = async (req, res) => {
  try {
    const { courseId, title, sections } = req.body;

    const lesson = new Lesson({
      courseId,
      title,
      sections, // sections contain subTitle, description, codeSnippets, notes
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

/**
 * @desc    Get all lessons for a specific course
 * @route   GET /api/lessons/:courseId
 * @access  Private (Professor & Students)
 */
export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId });

    res.status(200).json(lessons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lessons", error: error.message });
  }
};

/**
 * @desc    Get a single lesson by ID
 * @route   GET /api/lessons/lesson/:lessonId
 * @access  Private (Professor & Students)
 */
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

/**
 * @desc    Update a lesson
 * @route   PUT /api/lessons/update/:lessonId
 * @access  Private (Professor)
 */
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

/**
 * @desc    Delete a lesson
 * @route   DELETE /api/lessons/delete/:lessonId
 * @access  Private (Professor)
 */
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
