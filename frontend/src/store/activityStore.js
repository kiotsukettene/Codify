import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api/activities";

export const useActivityStore = create((set) => ({
  activities: [],
  activity: null,
  isLoading: false,
  error: null,

  // Fetch all activities by lesson ID
  fetchActivitiesByLesson: async (lessonId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/lesson/${lessonId}`);
      set({ activities: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching activities",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching activities");
    }
  },

  // Fetch all activities by course ID
  fetchActivitiesByCourse: async (courseId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`);

      set({ activities: response.data, isLoading: false });

      return response.data; // ✅ Return fetched activities for debugging
    } catch (error) {
      console.error("Error fetching activities by course:", error);
      set({
        error: error.response?.data?.message || "Error fetching activities",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching activities");

      return []; // ✅ Return empty array instead of undefined
    }
  },

  // Fetch a single activity by ID
  fetchActivityById: async (activityId) => {
    set({ isLoading: true, error: null });

    try {
      console.log(`Fetching activity with ID: ${activityId}`);
      const response = await axios.get(`${API_URL}/${activityId}`);
      set({ activity: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching activity");
    }
  },

  // Create a new activity
  createActivity: async (activityData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/create`, activityData);

      const newActivity = response.data.activity; // ✅ Extract the newly created activity

      set((state) => ({
        activities: [...state.activities, newActivity],
        isLoading: false,
      }));

      toast.success("Activity created successfully!");

      return newActivity; // ✅ Return the created activity so we can use it later
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error creating activity";

      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      return null; // ✅ Return null in case of an error
    }
  },

  // Update an existing activity
  updateActivity: async (activityId, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/${activityId}`, updatedData);
      set((state) => ({
        activities: state.activities.map((activity) =>
          activity._id === activityId ? response.data.updatedActivity : activity
        ),
        isLoading: false,
      }));
      toast.success("Activity updated successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error updating activity");
    }
  },

  // Delete an activity
  deleteActivity: async (activityId) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${API_URL}/${activityId}`);
      set((state) => ({
        activities: state.activities.filter(
          (activity) => activity._id !== activityId
        ),
        isLoading: false,
      }));
      toast.success("Activity deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error deleting activity");
    }
  },
}));
