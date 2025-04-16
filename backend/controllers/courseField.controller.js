// controllers/courseField.controller.js
import CourseField from "../models/courseField.model.js";

export const createCourseField = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug incoming data

    const { name, type, status } = req.body;

    // Validate required fields
    if (!name || !type || !status) {
      return res
        .status(400)
        .json({ message: "Name, type, and status are required" });
    }

    // Validate type against the enum defined in the schema
    const validTypes = ["ClassName", "Program", "Year", "Section"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type provided" });
    }

    // Validate status
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const courseField = new CourseField({
      name,
      type,
      status,
      lastModified: new Date(),
    });

    console.log("CourseField object before save:", courseField); // Debug
    await courseField.save();

    res.status(201).json({
      message: "Course field created successfully!",
      courseField,
    });
  } catch (error) {
    console.error("Error in createCourseField:", error); // Detailed error log
    res.status(500).json({
      message: "Error creating course field",
      error: error.message,
    });
  }
};

export const getCourseFieldsByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log("Fetching course fields for type:", type); // Debug

    // Validate type
    const validTypes = ["ClassName", "Program", "Year", "Section"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type provided" });
    }

    const courseFields = await CourseField.find({ type });
    res.status(200).json(courseFields);
  } catch (error) {
    console.error("Error fetching course fields:", error);
    res.status(500).json({
      message: "Error fetching course fields",
      error: error.message,
    });
  }
};

export const getCourseFieldById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseField = await CourseField.findById(id);

    if (!courseField) {
      return res.status(404).json({ message: "Course field not found" });
    }

    console.log("CourseField Data:", courseField); // Debug
    res.status(200).json(courseField);
  } catch (error) {
    console.error("Error fetching course field:", error);
    res.status(500).json({
      message: "Error fetching course field",
      error: error.message,
    });
  }
};

export const updateCourseField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    // Validate inputs
    if (!name || !status) {
      return res.status(400).json({ message: "Name and status are required" });
    }

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const updatedCourseField = await CourseField.findByIdAndUpdate(
      id,
      { name, status, lastModified: new Date() },
      { new: true }
    );

    if (!updatedCourseField) {
      return res.status(404).json({ message: "Course field not found" });
    }

    res.status(200).json({
      message: "Course field updated successfully!",
      updatedCourseField,
    });
  } catch (error) {
    console.error("Error updating course field:", error);
    res.status(500).json({
      message: "Error updating course field",
      error: error.message,
    });
  }
};

export const deleteCourseField = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourseField = await CourseField.findByIdAndDelete(id);

    if (!deletedCourseField) {
      return res.status(404).json({ message: "Course field not found" });
    }

    res.status(200).json({ message: "Course field deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course field:", error);
    res.status(500).json({
      message: "Error deleting course field",
      error: error.message,
    });
  }
};
