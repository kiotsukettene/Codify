import Activity from "../models/activity.model.js";
import Lesson from "../models/lesson.model.js";
import submissionModel from "../models/submission.model.js";
import mongoose from "mongoose";
import slugify from "slugify";

export const createActivity = async (req, res) => {
  try {
    const { lessonId, title, subTitle, instructions, dueDate, points } =
      req.body;
    const file = req.file ? req.file.path : null; // ✅ Get uploaded file path

    // ✅ Check if lesson exists before creating activity
    const lessonExists = await Lesson.findById(lessonId);
    if (!lessonExists) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    console.log("Received data:", req.body);
    // ✅ Create a new activity
    const activity = new Activity({
      lessonId,
      title,
      subTitle,
      instructions,
      points,
      file,
      slug,
      dueDate: dueDate && dueDate !== "null" ? new Date(dueDate) : undefined,
    });

    // ✅ Save the activity to the database
    const savedActivity = await activity.save();

    // ✅ Return the created activity with _id
    return res.status(201).json({
      message: "Activity created successfully!",
      activity: savedActivity, // Ensure the saved object is returned
    });
  } catch (error) {
    console.error("Error in createActivity:", error);
    return res.status(500).json({
      message: "Error creating activity",
      error: error.message,
    });
  }
};

// export const createActivity = async (activityData) => {
//   try {
//     const response = await fetch("/api/activities", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(activityData),
//     });

//     const data = await response.json();
//     console.log("API Response:", data); // ✅ Debugging

//     if (!data || !data._id) {
//       throw new Error("Activity creation failed: Missing _id");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error creating activity:", error);
//     return null;
//   }
// };

export const getActivityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const activity = await Activity.findOne({ slug });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Construct file URL if applicable
    let fileUrl = null;
    if (activity.file) {
      const fileName = activity.file.replace(/^uploads[\\/]/, "");
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    res.status(200).json({ ...activity._doc, file: fileUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity", error: error.message });
  }
};

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

export const getActivitiesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const objectIdCourseId = new mongoose.Types.ObjectId(courseId); // Convert to ObjectId

    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lessonData",
        },
      },
      { $unwind: "$lessonData" },
      { $match: { "lessonData.courseId": objectIdCourseId } }, // ✅ Ensure ObjectId match
      { $project: { lessonData: 0 } }, // Remove lessonData from response
    ]);

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities by course:", error);
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // ✅ Ensure correct file path format
    let fileUrl = null;
    if (activity.file) {
      const fileName = activity.file.replace(/^uploads[\\/]/, ""); // Remove leading 'uploads/' if present
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    res.status(200).json({ ...activity._doc, file: fileUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity", error: error.message });
  }
};

// export const getActivityById = async (req, res) => {
//   try {
//     const { activityId } = req.params;

//     // Find the activity by ID
//     const activity = await Activity.findById(activityId);

//     if (!activity) {
//       return res.status(404).json({ message: "Activity not found" });
//     }

//     res.status(200).json(activity);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching activity", error: error.message });
//   }
// };

// ✅ UPDATE ACTIVITY
export const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { title, subTitle, instructions, dueDate, points } = req.body;
    const file = req.file ? req.file.path : null;

    const updateData = {
      title,
      subTitle,
      instructions,
      dueDate: dueDate && dueDate !== "null" ? new Date(dueDate) : undefined,
      points,
    };

    if (file) {
      updateData.file = file;
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

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

// Add this to activity.controller.js
export const getStudentActivitiesByCourse = async (req, res) => {
  try {
    const { courseSlug } = req.params;

    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lessonData",
        },
      },
      { $unwind: "$lessonData" },
      {
        $lookup: {
          from: "courses",
          localField: "lessonData.courseId",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: "$courseData" },
      { $match: { "courseData.slug": courseSlug } },
    ]);

    const currentDate = new Date();
    const formattedActivities = activities.map((activity) => {
      const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
      let status = "Not Submitted";
      let isCompleted = false;

      if (dueDate && dueDate < currentDate) {
        status = "Missing"; // Past due, no submission assumed
      } else if (dueDate) {
        status = "Not Submitted"; // Due date in future or present
      } else {
        status = "Not Submitted"; // No due date
      }

      return {
        subject: activity.lessonData.title || "Unknown Subject",
        activity: activity.title,
        dueDate: dueDate ? dueDate.toLocaleString() : "No Due Date",
        status,
        isCompleted, // Always false without submission tracking
      };
    });

    res.status(200).json(formattedActivities);
  } catch (error) {
    console.error("Error fetching student activities:", error);
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

// In activity.controller.js
export const getStudentAllActivities = async (req, res) => {
  try {
    if (!req.studentId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No student ID available" });
    }

    const studentId = req.studentId; // Use req.studentId set by StudentVerifyToken
    console.log("Student ID:", studentId);

    const courses = await mongoose.model("Course").find({
      studentsEnrolled: studentId,
    });
    console.log("Enrolled courses:", courses);

    if (!courses.length) {
      console.log("No enrolled courses found for student");
      return res.status(200).json([]);
    }

    const courseIds = courses.map((course) => course._id);
    console.log("Course IDs:", courseIds);

    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lessonData",
        },
      },
      { $unwind: "$lessonData" },
      {
        $match: {
          "lessonData.courseId": { $in: courseIds },
        },
      },
    ]);
    console.log("Raw activities:", activities);

    const currentDate = new Date();
    const formattedActivities = activities.map((activity) => {
      const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
      let status = "Not Submitted";
      let isCompleted = false;

      if (dueDate && dueDate < currentDate) {
        status = "Missing";
      } else if (dueDate) {
        status = "Not Submitted";
      } else {
        status = "Not Submitted";
      }

      return {
        subject: activity.lessonData.title || "Unknown Subject",
        activity: activity.title,
        dueDate: dueDate ? dueDate.toLocaleString() : "No Due Date",
        status,
        isCompleted,
      };
    });

    console.log("Formatted activities:", formattedActivities);
    res.status(200).json(formattedActivities);
  } catch (error) {
    console.error("Error fetching all student activities:", error);
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};
