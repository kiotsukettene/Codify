import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/courseFields" // Local backend
  : `${import.meta.env.VITE_API_URL}/api/courseFields`; // Production backend

axios.defaults.withCredentials = true;
export const useCourseFieldStore = create((set) => ({
  courseFields: [],
  courseField: null,
  isLoading: false,
  error: null,

  // Fetch all course fields by type
  fetchCourseFieldsByType: async (type) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/type/${type}`);
      set({ courseFields: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching course fields",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching course fields"
      );
    }
  },

  // Fetch a single course field by ID
  fetchCourseFieldById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ courseField: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching course field",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching course field"
      );
    }
  },

  // Create a new course field
  createCourseField: async (courseFieldData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/create`, courseFieldData);
      set((state) => ({
        courseFields: [...state.courseFields, response.data.courseField],
        isLoading: false,
      }));
      toast.success("Course field created successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating course field",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error creating course field"
      );
    }
  },

  // Update an existing course field
  updateCourseField: async (id, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData);
      set((state) => ({
        courseFields: state.courseFields.map((field) =>
          field._id === id ? response.data.updatedCourseField : field
        ),
        isLoading: false,
      }));
      toast.success("Course field updated successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating course field",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error updating course field"
      );
    }
  },

  // Delete a course field
  deleteCourseField: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      set((state) => ({
        courseFields: state.courseFields.filter((field) => field._id !== id),
        isLoading: false,
      }));
      toast.success("Course field deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting course field",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error deleting course field"
      );
    }
  },
}));
