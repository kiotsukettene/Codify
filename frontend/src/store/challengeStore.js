import {create} from 'zustand'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import challenges from '@/constants/challenges';

axios.defaults.withCredentials = true;
const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/students/challenges" // Local backend
  : `${import.meta.env.VITE_API_URL}/api/students/challenges`; // Production backend



export const useChallengeStore = create((set) => ({
  challenges: challenges, // Static challenges from challenges.js
  solvedChallenges: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchSolvedChallenges: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/fetch-solved-challenges/${studentId}`, {
        withCredentials: true, // Include cookies for authentication
      });
      set({
        solvedChallenges: response.data.solvedChallenges,
        isLoading: false,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error fetching solved challenges';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  updateSolvedChallenges: async (studentId, challengeId, challengeTitle, challengeDifficulty, challengeCodeSubmitted) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/update-solved-challenges`,
        {
          studentId,
          challengeId,
          challengeTitle,
          challengeDifficulty,
          challengeCodeSubmitted,
        },
        { withCredentials: true } // Include cookies for authentication
      );

      if (response.status === 200) {
        set((state) => ({
          solvedChallenges: response.data.student.solvedChallenges, // Use the full array from backend
          isLoading: false,
        }));
        toast.success('Challenge solved successfully!');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error updating solved challenges';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error; // Throw error to handle in StudentPracticePage
    }
  },
}));

