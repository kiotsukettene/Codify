import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/courseFields"
  : `${import.meta.env.VITE_API_URL}/api/courseFields`;

axios.defaults.withCredentials = true;
export const useCourseFieldStore = create((set) => ({
  courseFields: [],
  courseField: null,
  isLoading: false,
  error: null,

  // Fetch all course fields by type
  fetchCourseFieldsByType: async (type) => {
    console.log(`[Store] Initiating fetchCourseFieldsByType for type: ${type}`);
    console.log(`[Store] API URL: ${API_URL}/type/${type}`);
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/type/${type}`);
      console.log(`[Store] Fetch response for type ${type}:`, {
        status: response.status,
        data: response.data,
      });
      set((state) => {
        // Filter out existing fields of the same type to avoid duplicates
        const updatedFields = [
          ...state.courseFields.filter((field) => field.type !== type),
          ...response.data,
        ];
        console.log(
          `[Store] Updated courseFields state for type ${type}:`,
          updatedFields
        );
        return { courseFields: updatedFields, isLoading: false };
      });
    } catch (error) {
      console.error(`[Store] Error fetching course fields for type ${type}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({
        error:
          error.response?.data?.message ||
          `Error fetching course fields for ${type}`,
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message ||
          `Error fetching course fields for ${type}`
      );
    }
  },

  // Fetch a single course field by ID
  fetchCourseFieldById: async (id) => {
    console.log(`[Store] Initiating fetchCourseFieldById for id: ${id}`);
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log("[Store] Fetch response for single field:", response.data);
      set({ courseField: response.data, isLoading: false });
    } catch (error) {
      console.error("[Store] Error fetching course field:", error);
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
    console.log("[Store] Creating course field with data:", courseFieldData);
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/`, courseFieldData);
      console.log("[Store] Create response:", response.data);
      set((state) => ({
        courseFields: [...state.courseFields, response.data.courseField],
        isLoading: false,
      }));
      toast.success("Course field created successfully!");
    } catch (error) {
      console.error("[Store] Error creating course field:", error);
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
    console.log(
      `[Store] Updating course field id: ${id} with data:`,
      updatedData
    );
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData);
      console.log("[Store] Update response:", response.data);
      set((state) => ({
        courseFields: state.courseFields.map((field) =>
          field._id === id ? response.data.updatedCourseField : field
        ),
        isLoading: false,
      }));
      toast.success("Course field updated successfully!");
    } catch (error) {
      console.error("[Store] Error updating course field:", error);
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
    console.log(`[Store] Deleting course field id: ${id}`);
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      console.log("[Store] Delete response:", response.data);
      set((state) => ({
        courseFields: state.courseFields.filter((field) => field._id !== id),
        isLoading: false,
      }));
      toast.success("Course field deleted successfully!");
    } catch (error) {
      console.error("[Store] Error deleting course field:", error);
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
