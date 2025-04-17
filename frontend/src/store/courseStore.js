import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/courses" // Local backend
  : `${import.meta.env.VITE_API_URL}/api/courses`; // Production backend

axios.defaults.withCredentials = true;
export const useCourseStore = create((set) => ({
  courses: [],
  course: null,
  isLoading: false,
  error: null,

  // Fetch all courses by institution ID (via professor's institution)
  fetchCoursesByProfessor: async () => {
    set({ isLoading: true, error: null });
    console.log("Fetching professor courses from:", `${API_URL}/professor-courses`);

    try {
      const response = await axios.get(`${API_URL}/professor-courses`);
      console.log("API Response:", response.data);
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching professor courses:", error.response?.data || error);
      set({
        error: error.response?.data?.message || "Error fetching professor courses",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching professor courses");
    }
  },

  // Fetch a single course by ID
  fetchCourseById: async (courseId) => {
    set({ isLoading: true, error: null });
    console.log("Fetching course with ID:", courseId); // Debug log

    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`);
      console.log("API Response:", response.data); // Debug log
      set({ course: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching course:", error.response?.data || error); // Debug log
      set({
        error: error.response?.data?.message || "Error fetching course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching course");
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    console.log("Creating course with data:", courseData); // Debug log

    try {
      const response = await axios.post(`${API_URL}/create`, courseData);
      console.log("API Response:", response.data); // Debug log
      set((state) => ({
        courses: [...state.courses, response.data.course],
        isLoading: false,
      }));
      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error); // Debug log
      set({
        error: error.response?.data?.message || "Error creating course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error creating course");
    }
  },

  fetchCoursesByInstitution: async () => {
    set({ isLoading: true, error: null });
    console.log("Fetching courses from:", `${API_URL}/courses`); // Debug log

    try {
      const response = await axios.get(`${API_URL}/courses`);
      console.log("API Response:", response.data); // Debug log
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error); // Debug log
      set({
        error: error.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching courses");
    }
  },

  // Update an existing course
  updateCourse: async (courseId, updatedData) => {
    set({ isLoading: true, error: null });
    console.log("Updating course with ID:", courseId, "Data:", updatedData); // Debug log

    try {
      const response = await axios.put(
        `${API_URL}/update/${courseId}`,
        updatedData
      );
      console.log("API Response:", response.data); // Debug log
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId ? response.data.updatedCourse : course
        ),
        isLoading: false,
      }));
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error); // Debug log
      set({
        error: error.response?.data?.message || "Error updating course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error updating course");
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    console.log("Deleting course with ID:", courseId); // Debug log

    try {
      await axios.delete(`${API_URL}/delete/${courseId}`);
      console.log("Course deleted successfully"); // Debug log
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== courseId),
        isLoading: false,
      }));
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error); // Debug log
      set({
        error: error.response?.data?.message || "Error deleting course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error deleting course");
    }
  },
}));