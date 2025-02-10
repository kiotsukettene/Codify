import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
//import { isAborted } from "zod";

const API_URL = "http://localhost:5000/api/auth"; //change sa local host 5000 kasi gamit q

axios.defaults.withCredentials = true;

export const useprofAuthStore = create((set) => ({
  professor: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  login: async (email, password) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(`${API_URL}/professor-login`, {
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
        error: error.response.data.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({
      isCheckingAuth: true,
      error: null,
    });
    try {
      const response = await axios.get(`${API_URL}/professor-check-auth`);
      set({
        professor: response.data.professor,
        role: "professor",
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: false,
        role: null,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(
        `${API_URL}/professor-forgot-password`,
        {
          email,
        }
      );
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
      const response = await axios.post(
        `${API_URL}/professor-reset-password/${token}`,
        {
          password,
        }
      );
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

  loginWithGoogle: async () => {
    try {
      window.location.href = "http://localhost:5000/api/auth/professor-google"; // Redirect user
    } catch (error) {
      toast.error("Google login failed", error);
    }
  },

  logoutProfessor: async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/professor-logout",
        {
          method: "POST",
          credentials: "include", // Ensure cookies are included in the request
        }
      );

      const data = await res.json();

      if (data.success) {
        set({ user: null, isAuthenticated: false }); // Reset state
        toast.success("Logged out successfully");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred during logout");
    }
  },
}));
