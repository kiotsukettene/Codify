import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config";
const API_URL = "http://localhost:3000/api/professors";

const storedProfessor = localStorage.getItem("professor");
const parsedProfessor =
  storedProfessor && storedProfessor !== "undefined"
    ? JSON.parse(storedProfessor)
    : null;

export const useprofAuthStore = create((set) => ({
  professor: parsedProfessor,
  isAuthenticated: !!parsedProfessor,
  professors: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

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
      //////missing error
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

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    const token = localStorage.getItem("token");

    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        professor: response.data.professor,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("professor");

      set({
        isCheckingAuth: false,
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
        toast.success("Logged out successfully");
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
}));
