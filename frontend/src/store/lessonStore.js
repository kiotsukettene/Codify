import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api/lessons";

export const useLessonStore = create((set) => ({
  lessons: [],
  lesson: null,
  isLoading: false,
  error: null,

  // Fetch all lessons by course ID
  fetchLessonsByCourse: async (courseId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${courseId}`);
      set({ lessons: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching lessons",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching lessons");
    }
  },

  // Fetch a single lesson by ID
  fetchLessonById: async (lessonId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${lessonId}`);
      set({ lesson: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching lesson",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching lesson");
    }
  },

  // Create a new lesson
  createLesson: async (lessonData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/create`, lessonData);
      set((state) => ({
        lessons: [...state.lessons, response.data.lesson],
        isLoading: false,
      }));
      toast.success("Lesson created successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating lesson",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error creating lesson");
    }
  },

  // Update an existing lesson
  updateLesson: async (lessonId, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/${lessonId}`, updatedData);
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson._id === lessonId ? response.data.updatedLesson : lesson
        ),
        isLoading: false,
      }));
      toast.success("Lesson updated successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating lesson",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error updating lesson");
    }
  },

  // Delete a lesson
  deleteLesson: async (lessonId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/${lessonId}`);
      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson._id !== lessonId),
        isLoading: false,
      }));
      toast.success("Lesson deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting lesson",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error deleting lesson");
    }
  },
}));
