import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/studentAuth";
axios.defaults.withCredentials = true;

export const useStudentAuthStore = create((set) => ({
    student: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                student: response.data.student,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in",
                isLoading: false
            });
            throw error;
        }
    },

    studentVerifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({
                student: response.data.student,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error verifying email",
                isLoading: false
            });
            throw error;
        }
    },

    checkAuthStudent: async () => {
        set({
            isCheckingAuth: true,
            error: null // Reset previous error
        });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({
                student: response.data.student,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error checking auth",
                isCheckingAuth: false,
                isAuthenticated: false
            });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({
                student: null,
                isAuthenticated: false,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging out",
                isLoading: false
            });
            throw error;
        }
    },
}));
