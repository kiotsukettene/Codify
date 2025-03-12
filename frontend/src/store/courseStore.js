import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api/courses";

export const useCourseStore = create((set) => ({
  courses: [],
  course: null,
  isLoading: false,
  error: null,

  // Fetch all courses by professor ID
  fetchCoursesByProfessor: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/courses`);
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching courses");
    }
  },

  // Fetch a single course by ID
  fetchCourseById: async (courseId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${courseId}`);
      set({ course: response.data, isLoading: false });
    } catch (error) {
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

    try {
      const response = await axios.post(`${API_URL}/create`, courseData);
      set((state) => ({
        courses: [...state.courses, response.data.course],
        isLoading: false,
      }));
      toast.success("Course created successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error creating course");
    }
  },

  // Update an existing course
  updateCourse: async (courseId, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/${courseId}`, updatedData);
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId ? response.data.updatedCourse : course
        ),
        isLoading: false,
      }));
      toast.success("Course updated successfully!");
    } catch (error) {
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

    try {
      await axios.delete(`${API_URL}/delete/${courseId}`);
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== courseId),
        isLoading: false,
      }));
      toast.success("Course deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error deleting course");
    }
  },
}));
