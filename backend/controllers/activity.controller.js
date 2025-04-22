import Activity from "../models/activity.model.js";
import Lesson from "../models/lesson.model.js";
import Submission from "../models/submission.model.js";
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

// export const getStudentAllActivities = async (req, res) => {
//   try {
//     if (!req.studentId) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No student ID available" });
//     }

//     const studentId = req.studentId; // Use req.studentId set by StudentVerifyToken
//     console.log("Student ID:", studentId);

//     const courses = await mongoose.model("Course").find({
//       studentsEnrolled: studentId,
//     });
//     console.log("Enrolled courses:", courses);

//     if (!courses.length) {
//       console.log("No enrolled courses found for student");
//       return res.status(200).json([]);
//     }

//     const courseIds = courses.map((course) => course._id);
//     console.log("Course IDs:", courseIds);

//     const activities = await Activity.aggregate([
//       {
//         $lookup: {
//           from: "lessons",
//           localField: "lessonId",
//           foreignField: "_id",
//           as: "lessonData",
//         },
//       },
//       { $unwind: "$lessonData" },
//       {
//         $match: {
//           "lessonData.courseId": { $in: courseIds },
//         },
//       },
//     ]);
//     console.log("Raw activities:", activities);

//     const currentDate = new Date();
//     const formattedActivities = activities.map((activity) => {
//       const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
//       let status = "Not Submitted";
//       let isCompleted = false;

//       if (dueDate && dueDate < currentDate) {
//         status = "Missing";
//       } else if (dueDate) {
//         status = "Not Submitted";
//       } else {
//         status = "Not Submitted";
//       }

//       return {
//         subject: activity.lessonData.title || "Unknown Subject",
//         activity: activity.title,
//         dueDate: dueDate ? dueDate.toLocaleString() : "No Due Date",
//         status,
//         isCompleted,
//       };
//     });

//     console.log("Formatted activities:", formattedActivities);
//     res.status(200).json(formattedActivities);
//   } catch (error) {
//     console.error("Error fetching all student activities:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching activities", error: error.message });
//   }
// };

export const createSubmission = async (req, res) => {
  try {
    const studentId = req.studentId; // From StudentVerifyToken
    const { activityId } = req.body; // Expect activityId from the request body
    const file = req.file ? req.file.path : null; // Handle uploaded file

    if (!studentId || !activityId) {
      return res
        .status(400)
        .json({ message: "Student ID and Activity ID are required" });
    }

    // Check if activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if a submission already exists for this student and activity
    const existingSubmission = await Submission.findOne({
      activityId,
      studentId,
    });
    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "Submission already exists for this activity" });
    }

    // Create new submission
    const submission = new Submission({
      activityId,
      studentId,
      status: "submitted", // Set to "submitted" on creation
      file, // Store file path if provided
    });

    const savedSubmission = await submission.save();

    // Construct file URL if applicable
    let fileUrl = null;
    if (savedSubmission.file) {
      const fileName = savedSubmission.file.replace(/^uploads[\\/]/, "");
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    res.status(201).json({
      message: "Submission created successfully",
      submission: { ...savedSubmission._doc, file: fileUrl },
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    res
      .status(500)
      .json({ message: "Error creating submission", error: error.message });
  }
};
// Update getStudentAllActivities to include submission status
export const getStudentAllActivities = async (req, res) => {
  try {
    if (!req.studentId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No student ID available" });
    }

    const studentId = req.studentId;
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
      {
        $lookup: {
          from: "submissions",
          let: { activityId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$activityId", "$$activityId"] },
                    {
                      $eq: [
                        "$studentId",
                        new mongoose.Types.ObjectId(studentId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "submissionData",
        },
      },
    ]);
    console.log("Raw activities:", activities);

    const currentDate = new Date();
    const formattedActivities = activities.map((activity) => {
      const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
      const submission = activity.submissionData[0]; // First submission (if any)
      let status = "Not Submitted";
      let isCompleted = false;

      if (submission && submission.status === "submitted") {
        status = "Completed";
        isCompleted = true;
      } else if (dueDate && dueDate < currentDate) {
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
        _id: activity._id, // Include for navigation
        slug: activity.slug, // Include for navigation
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

export const getSubmission = async (req, res) => {
  try {
    const studentId = req.studentId; // From StudentVerifyToken
    const { activityId } = req.params;

    if (!studentId || !activityId) {
      return res
        .status(400)
        .json({ message: "Student ID and Activity ID are required" });
    }

    const submission = await Submission.findOne({ activityId, studentId });
    if (!submission) {
      return res
        .status(404)
        .json({ message: "No submission found for this activity" });
    }

    let fileUrl = null;
    if (submission.file) {
      const fileName = submission.file.replace(/^uploads[\\/]/, "");
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    res.status(200).json({ ...submission._doc, file: fileUrl });
  } catch (error) {
    console.error("Error fetching submission:", error);
    res
      .status(500)
      .json({ message: "Error fetching submission", error: error.message });
  }
};

export const unsubmitActivity = async (req, res) => {
  try {
    const studentId = req.studentId; // From StudentVerifyToken
    const { activityId } = req.params;

    if (!studentId || !activityId) {
      return res
        .status(400)
        .json({ message: "Student ID and Activity ID are required" });
    }

    const submission = await Submission.findOneAndDelete({
      activityId,
      studentId,
    });
    if (!submission) {
      return res
        .status(404)
        .json({ message: "No submission found to unsubmit" });
    }

    res.status(200).json({ message: "Submission successfully removed" });
  } catch (error) {
    console.error("Error unsubmitting activity:", error);
    res
      .status(500)
      .json({ message: "Error unsubmitting activity", error: error.message });
  }
};

export const getSubmissionsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    // Validate activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Fetch all submissions for this activity and populate student details
    const submissions = await Submission.find({ activityId }).populate({
      path: "studentId",
      select: "firstName lastName email studentId",
    });

    // Transform submissions to include file URL if applicable
    const formattedSubmissions = submissions.map((submission) => {
      let fileUrl = null;
      if (submission.file) {
        const fileName = submission.file.replace(/^uploads[\\/]/, "");
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
      }
      return { ...submission._doc, file: fileUrl };
    });

    res.status(200).json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, comment } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (score !== undefined) {
      submission.score = Math.min(Math.max(0, Number(score)), 100);
    }
    if (comment !== undefined) {
      submission.comment = comment;
    }

    const updatedSubmission = await submission.save();

    res.status(200).json({
      message: "Submission updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    res
      .status(500)
      .json({ message: "Error updating submission", error: error.message });
  }
};
