import { create } from "zustand";
import axios from "axios";
import { TrainFrontTunnelIcon } from "lucide-react";
import { Fallback } from "@radix-ui/react-avatar";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config";
import toast from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  institution: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  clearError: () => set({ error: null }), // New function to reset error
  setInstitution: (institution) => set({ institution }),

  signup: async (
    email,
    password,
    name,
    institutionName,
    address,
    phoneNumber,
    subscription,
    plan,
    paymentMethod,
    amount
  ) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        institutionName,
        address,
        phoneNumber,
        subscription,
        plan,
        paymentMethod,
        amount,
      });
      set({
        institution: response.data.institution,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        institution: response.data.institution,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerificationCode: async (email) => {
    set({ isLoading: true, error: null }); // ✅ Reset error before resending

    try {
      const response = await axios.post(`${API_URL}/resend-verification`, {
        email,
      });

      set({ isLoading: false, error: null }); // ✅ Ensure error is cleared on success

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error resending verification code"
      );
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error resending verification code",
      });

      throw error;
    }
  },
  login: async (email, password) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        institution: response.data.institution,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
    set({
      isLoading: false,
    });
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    let token = null;

    // 🔹 First try-catch: Handle popup closure
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
      return; // ⛔ Exit early if popup was closed
    }

    // 🔹 Second try-catch: Handle backend token verification
    try {
      const response = await axios.post(`${API_URL}/google-login`, { token });

      set({
        institution: response.data.institution,
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
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await auth.signOut(); // Firebase logout
      await axios.post(`${API_URL}/logout`); // Backend logout

      set({ institution: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({
      isLoading: true,
      error: null,
      message: null,
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
        error: error.response.data.message || "Error sending reset link",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({
      isLoading: true,
      error: null,
      message: null,
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
  checkAuth: async () => {
    const state = useAuthStore.getState();

    if (state.isAuthenticated && state.institution) {
      set({ isCheckingAuth: false });
      return;
    }
    
    set({
      isCheckingAuth: true,
      error: null,
    });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        institution: response.data.institution,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: false,
      });
    }
  },
}));
