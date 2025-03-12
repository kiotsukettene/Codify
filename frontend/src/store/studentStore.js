import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth,googleProvider } from "@/firebase";

const API_URL = "http://localhost:3000/api/students";

axios.defaults.withCredentials = true;

export const useStudentStore = create((set) => ({
  student: null, // No need to initialize from localStorage
  isAuthenticated: false, // Authentication state based on cookies
  students: [],
  error: null,
  isLoading: false,
  isCheckingStudentAuth: true, // Used to check authentication status on page load
  message: null,

  // Fetch all students
  fetchStudents: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/list`);
      set({ students: response.data.students, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching students", isLoading: false });
    }
  },

  // Register a new student
  addStudent: async (studentData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/register`, {
        ...studentData,
        password: studentData.lastName, // Default password logic
      });

      set((state) => ({
        isLoading: false,
        students: [...state.students, response.data.student],
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding student", isLoading: false });
    }
  },

  // Delete a student
  deleteStudent: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/list/delete/${id}`);
      set((state) => ({
        students: state.students.filter((student) => student._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting student", isLoading: false });
    }
  },

  // Login student
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/loginStudent`, { email, password });
      set({ student: response.data.student, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async( email, password) => {
    set({ isLoading: true, error: null });

    let token = null;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      token = await result.user.getIdToken();
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google Sign-In cancelled.");
      } else {
        toast.error("Google Login Failed: " + error.message);
      }
      set({ isLoading: false });
      return; // ⛔ Exit early if popup was closed
    }

    try {
      const response = await axios.post(`${API_URL}/student-google-login`, { token });

      set({
        student: response.data.student,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in with Google",
        isLoading: false,
      })
    }

    set({ isLoading: false });
  },

  // Check if student is authenticated (used in protected routes)
  checkStudentAuth: async () => {
    set({ isCheckingStudentAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/student-check-auth`);
      set({ student: response.data.student, isAuthenticated: true, isCheckingStudentAuth: false });
    } catch (error) {
      set({ isCheckingStudentAuth: false, error: null, isAuthenticated: false });
    }
  },

  // Student forgot password
  studentForgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/student-forgot-password`, { email });
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Failed to send reset email" });
    }
  },

  // Student reset password
  studentResetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_URL}/student-reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error resetting password" });
      throw error;
    }
  },

  // Logout student
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/logoutStudent`, {}, { withCredentials: true });
      set({ student: null, isAuthenticated: false, isLoading: false });
      window.location.href = "/student/login"; // Redirect to login page
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));