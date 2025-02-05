import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/students";

axios.defaults.withCredentials = true;

export const useStudentStore = create((set) => ({
    students: [],
    isLoading: false,
    error: null,

    // Fetch all students
    fetchStudents: async () => {
        set({
            isLoading: true,
            error: null
        })

        try {
            const response = await axios.get(`${API_URL}/list`);
            set({
                students: response.data.students,
                isLoading: false
            })
        } catch (error) {
            set({
                error: error.respose?.data?.message || "Error fetching students",
                isLoading: false
            });
        }
    },

    // Register a new student

    addStudent: async (studentData) => {
        set({
            isLoading: true,
            error: null,
        })

        try {
            const response = await axios.post(`${API_URL}/register`, {
                ...studentData,
                password: studentData.lastName
            });

            set((state) => ({
                isLoading: false,
                students: [...state.students, response.data.student]
            }))
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error adding student",
                isLoading: false
            })
        }
    },

    // Delete a student
    deleteStudent: async (id) => {
        set({
            isLoading: true,
            error: null
        })

        try {
            await axios.delete(`${API_URL}/list/delete/${id}`);
            set((state) => ({
                students: state.students.filter((student) => student._id !== id),
                isLoading: false
            }))
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error deleting student",
                isLoading: false
            })
        }
    }

}))