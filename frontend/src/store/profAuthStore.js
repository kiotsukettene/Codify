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

export const useprofAuthStore = create((set) => ({
  professor: null,
  isAuthenticated: false,
  professors: [],
  institution: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  clearError: () => set({ error: null }),

  // ... (other functions like login, LoginWithGoogle, etc. remain unchanged)

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
        professors: state.professors.filter((professor) => professor._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting professor",
        isLoading: false,
      });
    }
  },

  // ... (other functions like logoutProfessor, fetchProfessorById, etc. remain unchanged)
}));