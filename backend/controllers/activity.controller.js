import Activity from "../models/activity.model.js";
import Lesson from "../models/lesson.model.js";

export const createActivity = async (req, res) => {
  try {
    const { lessonId, title, subTitle, instructions, dueDate, points } =
      req.body;

    // Check if lesson exists
    const lessonExists = await Lesson.findById(lessonId);
    if (!lessonExists) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Create activity
    const activity = new Activity({
      lessonId,
      title,
      subTitle,
      instructions,
      dueDate,
      points,
    });

    await activity.save();

    res.status(201).json({
      message: "Activity created successfully!",
      activity,
    });
  } catch (error) {
    console.error("Error in createActivity:", error);
    res
      .status(500)
      .json({ message: "Error creating activity", error: error.message });
  }
};

// ✅ GET ALL ACTIVITIES FOR A LESSON
export const getActivitiesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if lesson exists
    const lessonExists = await Lesson.findById(lessonId);
    if (!lessonExists) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const activities = await Activity.find({ lessonId });

    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

// ✅ GET SINGLE ACTIVITY BY ID
export const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    res.status(200).json(activity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity", error: error.message });
  }
};

// ✅ UPDATE ACTIVITY
export const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedActivity)
      return res.status(404).json({ message: "Activity not found" });

    res.status(200).json({
      message: "Activity updated successfully!",
      updatedActivity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating activity", error: error.message });
  }
};

// ✅ DELETE ACTIVITY
export const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(activityId);

    if (!deletedActivity)
      return res.status(404).json({ message: "Activity not found" });

    res.status(200).json({ message: "Activity deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting activity", error: error.message });
  }
};
