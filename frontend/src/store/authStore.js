import { create } from 'zustand'
import axios from 'axios'

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    institution: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name, institutionName, address, phoneNumber, subscription, plan, paymentMethod, amount) => {
        set({
            isLoading: true,
            error: null
        })
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
                amount
            })
            set({
                institution: response.data.institution,
                isAuthenticated: true,
                isLoading: false
            })
        } catch (error) {
            set({
                error: error.response.data.message || "Error signing up",
                isLoading: false
            })
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({
            isLoading: true,
            error: null
        })
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code })
            set({
                institution: response.data.institution,
                isAuthenticated: true,
                isLoading: false,
                error: null
            })
            return response.data
        } catch (error) {
            set({
                error: error.response.data.message || "Error verifying email",
                isLoading: false
            })
            throw error;
        }
    },

    login: async (email, password) => {
        set({
            isLoading: true,
            error: null,
        })

        try {
            const response = await axios.post(`${API_URL}/login`, { email, password })
            set({
                institution: response.data.institution,
                isAuthenticated: true,
                error: null,
                isLoading: false
            })
        } catch (error) {
            set({
                error: error.response.data.message || "Error logging in",
                isLoading: false
            })
            throw error;
        }
    },

    checkAuth: async () => {
        
        set({
            isCheckingAuth: true,
            error: null
        })
        try {
            const response = await axios.get(`${API_URL}/check-auth`)
            set({
                institution: response.data.institution,
                isAuthenticated: true,
                isCheckingAuth: false
            })
        } catch (error) {
            set({
                isCheckingAuth: false,
                error: null,
                isAuthenticated: false
            })
        }
    }
}))
