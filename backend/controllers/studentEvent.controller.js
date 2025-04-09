import mongoose from "mongoose";
import { Student } from "../models/student.model.js";

export const addEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, priority } = req.body;

    console.log("Received addEvent request:", req.body);
    console.log("Request cookies in addEvent:", req.cookies);
    console.log("Request headers in addEvent:", req.headers);

    // Use the student ID from the middleware
    console.log("Student ID from middleware in addEvent:", req.studentId);
    if (!req.studentId) {
      console.log("Unauthorized: Student not authenticated, returning 401");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student not authenticated",
      });
    }

    // Validations
    if (!title || !date || !startTime || !endTime || !priority) {
      return res.status(400).json({
        success: false,
        message: "Title, date, start time, end time, and priority are required",
      });
    }

    // Priority validation (case-insensitive)
    const normalizedPriority = priority.toLowerCase();
    if (!["low", "medium", "high"].includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be one of: low, medium, high",
      });
    }

    // Transform priority to match the schema's enum values (e.g., "low" -> "Low")
    const schemaPriority = normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1);

    const student = await Student.findById(req.studentId);
    if (!student) {
      console.log("Student not found for ID:", req.studentId);
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = endTime ? new Date(`${date}T${endTime}`) : null;

    console.log("Parsed dates:", { startDateTime, endDateTime });

    // Validate that endDateTime is after startDateTime (if endDateTime exists)
    if (endDateTime && endDateTime <= startDateTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Create new event
    const newEvent = {
      id: new mongoose.Types.ObjectId().toString(),
      title,
      start: startDateTime,
      end: endDateTime,
      priority: schemaPriority,
      allDay: false,
      createdAt: new Date(),
    };

    console.log("New event to be added:", newEvent);

    student.events.push(newEvent);
    console.log("Saving student with new event...");
    await student.save();

    console.log("Event created successfully:", newEvent);

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: {
        id: newEvent.id,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay,
        priority: newEvent.priority,
      },
    });
  } catch (error) {
    console.error("Error in addEvent:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;

    console.log("Received getEvents request:", { start, end });
    console.log("Request cookies in getEvents:", req.cookies);
    console.log("Request headers in getEvents:", req.headers);

    console.log("Student ID from middleware in getEvents:", req.studentId);
    if (!req.studentId) {
      console.log("Unauthorized: Student not authenticated, returning 401");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student not authenticated",
      });
    }

    const student = await Student.findById(req.studentId).select("events");

    if (!student) {
      console.log("Student not found for ID:", req.studentId);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Filter events by date range
    let events = student.events;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      console.log("Parsed dates:", { startDate, endDate });
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start or end date",
        });
      }
      events = events.filter((event) => {
        const eventStart = new Date(event.start);
        return (
          eventStart >= startDate &&
          (!event.end || new Date(event.end) <= endDate)
        );
      });
    }

    // Format events for response
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      priority: event.priority,
    }));

    console.log("Returning events:", formattedEvents);

    res.status(200).json({
      success: true,
      data: formattedEvents,
    });
  } catch (error) {
    console.error("Error in getEvents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, date, startTime, endTime, priority } = req.body;

    console.log("Received editEvent request:", { eventId, ...req.body });
    console.log("Request cookies in editEvent:", req.cookies);
    console.log("Request headers in editEvent:", req.headers);

    console.log("Student ID from middleware in editEvent:", req.studentId);
    if (!req.studentId) {
      console.log("Unauthorized: Student not authenticated, returning 401");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student not authenticated",
      });
    }

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    if (!title || !date || !startTime || !endTime || !priority) {
      return res.status(400).json({
        success: false,
        message: "Title, date, start time, end time, and priority are required",
      });
    }

    const normalizedPriority = priority.toLowerCase();
    if (!["low", "medium", "high"].includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be one of: low, medium, high",
      });
    }

    const schemaPriority = normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1);

    const student = await Student.findById(req.studentId);
    if (!student) {
      console.log("Student not found for ID:", req.studentId);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const eventIndex = student.events.findIndex((event) => event.id === eventId);
    if (eventIndex === -1) {
      console.log("Event not found for ID:", eventId);
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = endTime ? new Date(`${date}T${endTime}`) : null;

    console.log("Parsed dates:", { startDateTime, endDateTime });

    if (endDateTime && endDateTime <= startDateTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const updatedEvent = {
      id: eventId,
      title,
      start: startDateTime,
      end: endDateTime,
      priority: schemaPriority,
      allDay: false,
      createdAt: student.events[eventIndex].createdAt,
    };

    console.log("Updated event:", updatedEvent);

    student.events[eventIndex] = updatedEvent;
    console.log("Saving student with updated event...");
    await student.save();

    console.log("Event updated successfully:", updatedEvent);

    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      event: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        start: updatedEvent.start,
        end: updatedEvent.end,
        allDay: updatedEvent.allDay,
        priority: updatedEvent.priority,
      },
    });
  } catch (error) {
    console.error("Error in editEvent:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log("Received deleteEvent request:", { eventId });
    console.log("Request cookies in deleteEvent:", req.cookies);
    console.log("Request headers in deleteEvent:", req.headers);

    // Use the student ID from the middleware
    console.log("Student ID from middleware in deleteEvent:", req.studentId);
    if (!req.studentId) {
      console.log("Unauthorized: Student not authenticated, returning 401");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student not authenticated",
      });
    }

    // Validations
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const student = await Student.findById(req.studentId);
    if (!student) {
      console.log("Student not found for ID:", req.studentId);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Find the event in the student's events array
    const eventIndex = student.events.findIndex((event) => event.id === eventId);
    if (eventIndex === -1) {
      console.log("Event not found for ID:", eventId);
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Remove the event from the array
    student.events.splice(eventIndex, 1);
    console.log("Saving student after deleting event...");
    await student.save();

    console.log("Event deleted successfully:", eventId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};