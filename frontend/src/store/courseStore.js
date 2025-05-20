import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/courses"
  : `${import.meta.env.VITE_API_URL}/api/courses`;

axios.defaults.withCredentials = true;

export const useCourseStore = create((set) => ({
  courses: [],
  course: null,
  uniqueStudentCount: 0, // Initialize uniqueStudentCount
  isLoading: false,
  error: null,

  fetchCoursesByProfessor: async () => {
    set({ isLoading: true, error: null });
    console.log(
      "Fetching professor courses from:",
      `${API_URL}/professor-courses`
    );

    try {
      const response = await axios.get(`${API_URL}/professor-courses`);
      console.log("API Response:", response.data);
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      console.error(
        "Error fetching professor courses:",
        error.response?.data || error
      );
      set({
        error:
          error.response?.data?.message || "Error fetching professor courses",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching professor courses"
      );
    }
  },

  fetchUniqueStudentCountByProfessor: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Handle query parameters for filtering (e.g., year, section, program)
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams
        ? `${API_URL}/professor/unique-student-count?${queryParams}`
        : `${API_URL}/professor/unique-student-count`;
      const response = await axios.get(url);
      set({
        uniqueStudentCount: response.data.uniqueStudentCount,
        isLoading: false,
      });
    } catch (error) {
      console.error(
        "Error fetching professor courses:",
        error.response?.data || error
      );
      set({
        error: error.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching courses");
    }
  },

  fetchUniqueStudentCountByProfessor: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Handle query parameters for filtering (e.g., year, section, program)
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams
        ? `${API_URL}/professor/unique-student-count?${queryParams}`
        : `${API_URL}/professor/unique-student-count`;
      const response = await axios.get(url);
      set({
        uniqueStudentCount: response.data.uniqueStudentCount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error fetching unique student count",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching unique student count"
      );
    }
  },

  fetchCourseById: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`);
      set({ course: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching course");
    }
  },

  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    try {
      // Check for duplicate course
      const {  section, professorId, institutionId } =
        courseData;
      const responseCheck = await axios.get(`${API_URL}/courses`, {
        params: {
          section,
          professorId,
          institutionId,
        },
      });

      if (responseCheck.data.length > 0) {
        set({ isLoading: false });
        toast.error("A course with these details already exists!");
        return;
      }

      // Proceed with course creation if no duplicates
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

  fetchCoursesByInstitution: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/courses`);
      console.log("Fetched courses:", response.data); // Log the response
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching courses");
    }
  },

  fetchCourseBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/slug/${slug}`);
      set({ course: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching course",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching course");
    }
  },

  updateCourse: async (courseId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/update/${courseId}`,
        updatedData
      );
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