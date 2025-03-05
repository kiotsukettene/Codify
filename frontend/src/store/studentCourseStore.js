import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api/students/courses"; 

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
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/student/course/lessons/${courseId}`);
      set({ lessons: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching lessons", loading: false });
    }
  },


}))

export default useStudentCourseStore;

