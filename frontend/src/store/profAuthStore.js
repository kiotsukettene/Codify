import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/professors" // Local backend
  : `${import.meta.env.VITE_API_URL}/api/professors`; // Production backend

axios.defaults.withCredentials = true;

export const useprofAuthStore = create((set, get) => ({
  professor: null,
  isAuthenticated: false,
  professors: [],
  institution: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  clearError: () => set({ error: null }),

  getTotalProf: () => {
    const { professors } = get();
    return professors.length;
  },
  fetchProfessorById: async (professorId) => {
    set({ isLoading: true, error: null });
    try {
      // Assumes your GET endpoint returns { professor, courseCount }
      const response = await axios.get(`${API_URL}/${professorId}`);
      const { professor, courseCount } = response.data;

      set({ 
        professor,
        courseCount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching professor",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching professor");
    }
  },

  fetchProfessors: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/list`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch professors");
      }
      
      set({
        professors: response.data.professors,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching professors:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error fetching professors";
      set({
        error: errorMessage,
        isLoading: false,
        professors: []
      });
      toast.error(errorMessage);
    }
  },

  AddProfessor: async (professorData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/register`, {
        ...professorData,
        password: professorData.lastName, // Default password logic (same as students)
      });

      set((state) => ({
        isLoading: false,
        professors: [...state.professors, response.data.professor], // Fixed typo: was "students"
      }));
      toast.success("Professor added successfully");
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || "Error adding professor",
        isLoading: false,
        professors: state.professors, // Preserve the existing professors array on error
      }));
      toast.error(error.response?.data?.message || "Error adding professor");
    }
  },

  deleteProfessor: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/list/delete/${id}`);
      set((state) => ({
        professors: state.professors.filter(
          (professor) => professor._id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting professor",
        isLoading: false,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        professor: response.data.professor,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  LoginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    let token = null;

    // First try-catch: Handle popup closure
    try {
      const result = await signInWithPopup(auth, googleProvider);
      token = await result.user.getIdToken(); // ✅ Get Firebase token
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google Sign-In cancelled.");
      } else {
        toast.error("Google Login Failed: " + error.message);
      }
      set({ isLoading: false });
      return;
    }

    // Second try-catch: Handle backend token verification
    try {
      const response = await axios.post(`${API_URL}/google-login`, {
        token,
      });

      set({
        professor: response.data.professor,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Login successful!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Server Error",
        isLoading: false,
      });
    }

    set({ isLoading: false });
  },

  checkProfAuth: async () => {
    const state = useprofAuthStore.getState();
    if (state.isAuthenticated && state.professor) {
      set({ isCheckingProfAuth: false });
      return; // Skip API call if already authenticated
    }
    set({ isCheckingProfAuth: true, error: null });

    try {
      // ✅ No need to manually get token, browser sends it automatically
      const response = await axios.get(`${API_URL}/professor-check-auth`);

      set({
        professor: response.data.professor,
        isAuthenticated: true,
        isCheckingProfAuth: false,
      });
    } catch (error) {
      set({
        isCheckingProfAuth: false,
        isAuthenticated: false,
        error: error.response?.data?.message || "Authentication failed",
      });
    }
  },
  forgotPassword: async (email) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error sending email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  updateProfessor: async (professorData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.put(
        `${API_URL}/update/${professorData._id}`,
        professorData
      );

      set({
        professor: response.data.professor,
        isLoading: false,
      });

      toast.success("Professor updated successfully");
    } catch (error) {
      set({
        error: error.response.data.message || "Error updating professor",
        isLoading: false,
      });
      toast.error(error.response.data.message || "Error updating professor");
    }
  },

  logoutProfessor: async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        set({ professor: null, isAuthenticated: false });
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  },
}));