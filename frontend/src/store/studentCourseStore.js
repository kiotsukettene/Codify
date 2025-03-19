import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/students/courses" // Local backend
  : `${import.meta.env.VITE_API_URL}/api/students/courses`; // Production backend

// Debug to confirm the URL
console.log("Environment:", import.meta.env.MODE);
console.log("API_URL:", API_URL);

const useStudentCourseStore = create((set) => ({
    enrolledCourses: [],
    lessons: [],
    isLoading: false,
    error: null,
    clearError: () => set({ error: null }),


    // Fetch enrolled courses

    fetchEnrolledCourses: async () => {
        set({
            isLoading: true,
            error: null,
        })

        try {
            const response = await axios.get(`${API_URL}/enrolled`)
            set({
                enrolledCourses: response.data,
                isLoading: false
            })
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error fetching enrolled courses";
            set({ error: errorMsg, isLoading: false });
            
        }
    },

    joinCourse: async (courseCode) => {
        set({
            isLoading: true, error: null
        })
        try {
            const response = await axios.post(`${API_URL}/join`, { courseCode })
            console.log("Join course response:", response.data); // Debug response
            if (response.data.course) {
            set((state) => ({
                enrolledCourses: [...state.enrolledCourses, response.data.course],
                isLoading: false,
            }));
            return true;
            } else {
            throw new Error("Invalid response format from server");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error joining course";
            set({ error: errorMsg, isLoading: false });
            return false;
        }
    },

    // Fetch lessons for a course
    fetchLessonsForCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/lessons/${courseId}`);
      // Ensure lessons is an array, even if response.data is unexpected
      const lessonsData = Array.isArray(response.data) ? response.data : [];
      set({ lessons: lessonsData, isLoading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error fetching lessons";
      set({ lessons: [], error: errorMsg, isLoading: false }); // Reset to empty array on error
      toast.error(errorMsg);
    }
    },
    
    // New action to fetch a specific course by ID
    fetchCourseById: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set({ currentCourse: response.data, isLoading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error fetching course";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },


}))

export default useStudentCourseStore;

