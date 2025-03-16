import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config";
const API_URL = "http://localhost:3000/api/professors";

axios.defaults.withCredentials = true;

export const useprofAuthStore = create((set) => ({
  professor: null,
  isAuthenticated: false,
  professors: [],
  institution: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  clearError: () => set({ error: null }), // New function to reset error

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
        loading: false,
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
    } catch (error) {
      set({
        error: error.response?.data?.message || "Server Error",
        isLoading: false,
      });
    }

    set({ isLoading: false });
  },

  checkProfAuth: async () => {
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

  AddProfessor: async (professorData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/professors/register",
        professorData
      );

      const { professor, token } = response.data;

      if (token && professor) {
        localStorage.setItem("token", token);
        localStorage.setItem("professor", JSON.stringify(professor));
      } else {
        console.error(
          "No token or professor data received after registration!"
        );
      }

      set({
        professor,
        isAuthenticated: true,
        isLoading: false,
      });

      await useprofAuthStore.getState().checkAuth();
      toast.success("Professor added successfully");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding professor",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error adding professor");
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

  fetchProfessors: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/list`);
      set({
        professors: response.data.professors,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching professors",
        isLoading: false,
      });
    }
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
}));
