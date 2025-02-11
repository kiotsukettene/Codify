import { create } from "zustand";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/students";

axios.defaults.withCredentials = true;

export const useStudentStore = create((set) => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));

return {

    student: storedStudent || null,
    isAuthenticated: !!storedStudent, // ✅ Set authentication state based on stored student
    students: null,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

  // Fetch all students
  fetchStudents: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.get(`${API_URL}/list`);
      set({
        students: response.data.students,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching students",
        isLoading: false,
      });
    }
  },

  // Register a new student
  addStudent: async (studentData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      console.log("API URL:", API_URL); // Debugging API URL

      const response = await axios.post(`${API_URL}/register`, {
        ...studentData,
        password: studentData.lastName,
      });

      set((state) => ({
        isLoading: false,
        students: [...state.students, response.data.student],
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding student",
        isLoading: false,
      });
    }
  },

  // Delete a student
  deleteStudent: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await axios.delete(`${API_URL}/list/delete/${id}`);
      set((state) => ({
        students: state.students.filter((student) => student._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting student",
        isLoading: false,
      });
    }
  },

  // Login student
  login: async (email, password) => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axios.post(`${API_URL}/loginStudent`, {
        email,
        password,
      });
      set({
        student: response.data.student,
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

 // ✅ Check if student is authenticated (Used in Protected Routes)
 checkStudentAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/student-check-auth`);

      set({
        student: response.data.student,
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

  // Student forgot password
  studentForgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/student-forgot-password`, {
        email,
      });
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to send reset email",
      });
    }
  },

  // Student reset password
  studentResetPassword: async (token, password) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await axios.post(
        `${API_URL}/student-reset-password/${token}`,
        { password }
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

  // ✅ Function to store student authentication
  setStudent: (studentData) => {
    set({
      student: studentData,
      isAuthenticated: true,
    });
    localStorage.setItem("student", JSON.stringify(studentData)); // ✅ Store student in LocalStorage
  },

  // ✅ Logout student
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
        await axios.post(`${API_URL}/logoutStudent`, {}, { withCredentials: true });

        // ✅ Remove student from local storage and update state
        localStorage.removeItem("student");
        set({
            student: null,
            isAuthenticated: false,
            isLoading: false,
        });

        // ✅ Force page reload to apply changes
        window.location.href = "/student-login";

    } catch (error) {
        set({
            error: "Error logging out",
            isLoading: false,
        });
    }
},

}
});
