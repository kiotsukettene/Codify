import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/activities"
  : `${import.meta.env.VITE_API_URL}/api/activities`;

axios.defaults.withCredentials = true;

export const useActivityStore = create((set) => ({
  activities: [],
  activity: null,
  submission: null,
  submissions: [],
  isLoading: false,
  error: null,

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

  fetchActivitiesByCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`);
      set({ activities: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching activities",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching activities");
      return [];
    }
  },

  fetchActivityById: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
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

  fetchActivityBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/slug/${slug}`);
      set({ activity: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching activity");
    }
  },

  fetchSubmissionsByActivity: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching submissions for activity ID:", activityId);
      const response = await axios.get(`${API_URL}/submissions/${activityId}`);
      console.log("Submissions fetched:", response.data);
      set({ submissions: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      set({
        error: error.response?.data?.message || "Error fetching submissions",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching submissions"
      );
      return [];
    }
  },

  createActivity: async (activityData, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("lessonId", activityData.lessonId);
      formData.append("title", activityData.title);
      formData.append("subTitle", activityData.subTitle);
      formData.append("instructions", activityData.instructions);
      formData.append("dueDate", activityData.dueDate);
      formData.append("points", activityData.points);
      files.forEach((file) => formData.append("file", file));

      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newActivity = response.data.activity;
      set((state) => ({
        activities: [...state.activities, newActivity],
        isLoading: false,
      }));
      toast.success("Activity created successfully! 🎉");
      return newActivity;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error creating activity");
      return null;
    }
  },

  updateActivity: async (activityId, updatedData, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", updatedData.title);
      formData.append("subTitle", updatedData.subTitle);
      formData.append("instructions", updatedData.instructions);
      formData.append("dueDate", updatedData.dueDate);
      formData.append("points", updatedData.points);
      files.forEach((file) => {
        if (!file.existing) formData.append("file", file);
      });

      const response = await axios.put(`${API_URL}/${activityId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        activities: state.activities.map((activity) =>
          activity._id === activityId ? response.data.updatedActivity : activity
        ),
        activity: response.data.updatedActivity,
        isLoading: false,
      }));
      toast.success("Activity updated successfully! 🎉");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error updating activity");
    }
  },

  deleteActivity: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${activityId}`);
      set((state) => ({
        activities: state.activities.filter(
          (activity) => activity._id !== activityId
        ),
        activity: null,
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

  fetchStudentActivitiesByCourse: async (courseSlug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/student/course/slug/${courseSlug}`
      );
      set({ activities: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error fetching student activities",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching student activities"
      );
      return [];
    }
  },

  fetchStudentAllActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/student/all-activities`);
      set({ activities: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error fetching all student activities",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error fetching all student activities"
      );
      return [];
    }
  },

  submitActivity: async (activityId, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("activityId", activityId);
      if (file) formData.append("file", file);

      const response = await axios.post(`${API_URL}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ isLoading: false });
      toast.success("Submission successful!");
      return response.data.submission;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error submitting activity",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error submitting activity");
      return null;
    }
  },

  fetchSubmission: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/submission/${activityId}`);
      set({ submission: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        set({ submission: null, isLoading: false });
        return null;
      }
      set({
        error: error.response?.data?.message || "Error fetching submission",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching submission");
      return null;
    }
  },

  updateSubmission: async (submissionId, updates) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Updating submission ID:", submissionId, "Updates:", updates);
      const response = await axios.put(
        `${API_URL}/submissions/${submissionId}`,
        updates
      );
      console.log("Submission updated:", response.data.submission);
      set((state) => ({
        submissions: state.submissions.map((sub) =>
          sub._id === submissionId ? response.data.submission : sub
        ),
        isLoading: false,
      }));
      toast.success("Submission updated successfully!");
      return response.data.submission;
    } catch (error) {
      console.error("Error updating submission:", error);
      set({
        error: error.response?.data?.message || "Error updating submission",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error updating submission");
      return null;
    }
  },

  unsubmitActivity: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/submission/${activityId}`);
      set({ submission: null, isLoading: false });
      toast.success("Submission removed successfully!");
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error unsubmitting activity",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Error unsubmitting activity"
      );
      return false;
    }
  },
}));
