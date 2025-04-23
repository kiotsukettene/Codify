import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

axios.defaults.withCredentials = true;

const loadNotificationsFromStorage = () => {
  const stored = localStorage.getItem("notifications");
  return stored ? JSON.parse(stored) : [];
};

const loadUnreadCountFromStorage = () => {
  const stored = localStorage.getItem("unreadNotifications");
  return stored ? parseInt(stored, 10) : 0;
};

const createBattleSlice = (set, get) => ({
  battleData: {
    title: "",
    description: "",
    duration: "",
    commencement: "",
    courseId: "",
    program: "",
    section: "",
    player1: "",
    player2: "",
    challenges: [
      {
        problemTitle: "",
        problemDescription: "",
        points: 100,
        inputConstraints: ["", "", ""],
        expectedOutput: ["", "", ""],
      },
    ],
    rules: "",
  },
  selectedCourse: null,
  selectedProgram: "",
  selectedSection: "",
  open: false,
  courseValue: "",
  isSubmitting: false,
  error: null,

  setBattleData: (updates) => set((state) => ({
    battleData: { ...state.battleData, ...updates },
  })),
  addChallenge: () => set((state) => ({
    battleData: {
      ...state.battleData,
      challenges: [
        ...state.battleData.challenges,
        {
          problemTitle: "",
          problemDescription: "",
          points: 100,
          inputConstraints: ["", "", ""],
          expectedOutput: ["", "", ""],
        },
      ],
    },
  })),
  updateChallenge: (index, field, value) => set((state) => {
    const newChallenges = [...state.battleData.challenges];
    newChallenges[index] = { ...newChallenges[index], [field]: value };
    return { battleData: { ...state.battleData, challenges: newChallenges } };
  }),
  removeChallenge: (index) => set((state) => {
    if (state.battleData.challenges.length > 1) {
      const updatedChallenges = state.battleData.challenges.filter((_, i) => i !== index);
      return { battleData: { ...state.battleData, challenges: updatedChallenges } };
    }
    return state;
  }),
  selectCourse: (courseId, courses) => set((state) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return state;
    return {
      courseValue: courseId,
      selectedCourse: {
        id: course._id,
        name: course.className,
        programs: [
          ...new Set(
            courses
              .filter((c) => c.className === course.className)
              .map((c) => c.program)
              .filter(Boolean)
          ),
        ],
        sections: [
          ...new Set(
            courses
              .filter((c) => c.className === course.className)
              .map((c) => c.section)
              .filter(Boolean)
          ),
        ],
        studentsByProgramAndSection: courses
          .filter((c) => c.className === course.className)
          .map((c) => ({
            program: c.program,
            section: c.section,
            students: (c.studentsEnrolled || []).map((student) => ({
              id: student._id,
              name: `${student.firstName} ${student.lastName}`,
            })),
          })),
      },
      selectedProgram: "",
      selectedSection: "",
      battleData: {
        ...state.battleData,
        courseId,
        program: "",
        section: "",
        player1: "",
        player2: "",
      },
    };
  }),
  selectProgram: (program) => set((state) => {
    if (!state.selectedCourse) return state;
    return {
      selectedProgram: program,
      selectedSection: "",
      battleData: {
        ...state.battleData,
        program: program,
        section: "",
        player1: "",
        player2: "",
      },
    };
  }),
  selectSection: (section) => set((state) => {
    if (!state.selectedCourse || !state.selectedProgram) return state;
    return {
      selectedSection: section,
      battleData: {
        ...state.battleData,
        section: section,
        player1: "",
        player2: "",
      },
    };
  }),
  setOpen: (value) => set({ open: value }),
  getAvailablePlayers: (currentPlayerId) => () => {
    const state = get();
    if (!state.selectedCourse || !state.selectedProgram || !state.selectedSection) return [];
    const programSection = state.selectedCourse.studentsByProgramAndSection.find(
      (entry) => entry.program === state.selectedProgram && entry.section === state.selectedSection
    );
    const students = programSection ? programSection.students : [];
    if (currentPlayerId === "player1") {
      return students.filter((player) => player.id !== state.battleData.player2);
    } else {
      return students.filter((player) => player.id !== state.battleData.player1);
    }
  },
  submitBattle: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const state = get();
      if (
        !state.battleData.title ||
        !state.battleData.description ||
        !state.battleData.duration ||
        !state.battleData.courseId ||
        !state.battleData.program ||
        !state.battleData.section ||
        !state.battleData.player1 ||
        !state.battleData.player2
      ) {
        throw new Error("Please fill in all required fields");
      }
      const challenges = state.battleData.challenges;
      for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        if (!challenge.problemTitle.trim() || !challenge.problemDescription.trim()) {
          throw new Error(`Challenge ${i + 1} is missing title or description`);
        }
        if (
          !Array.isArray(challenge.inputConstraints) ||
          !Array.isArray(challenge.expectedOutput) ||
          challenge.inputConstraints.length !== 3 ||
          challenge.expectedOutput.length !== 3 ||
          challenge.inputConstraints.some((input) => !input || input.trim() === "") ||
          challenge.expectedOutput.some((output) => !output || output.trim() === "")
        ) {
          throw new Error(
            `Challenge ${i + 1} must have exactly 3 non-empty input constraints and expected outputs`
          );
        }
        if (!challenge.points || challenge.points <= 0) {
          throw new Error(`Challenge ${i + 1} must have valid points (greater than 0)`);
        }
      }
      const response = await axios.post(`${API_URL}/create`, {
        ...state.battleData,
        status: "active",
        commencement: new Date().toISOString(),
      });
      console.log("Create battle response:", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      state.addNotification({
        title: `New Battle: ${state.battleData.title}`,
        message: `You've been selected for a code battle: ${state.battleData.description}`,
        battleCode: response.data.battle.battleCode,
        time: Date.now(), // Add timestamp
      });
      toast.success("Battle commenced successfully!");
      set({
        battleData: {
          title: "",
          description: "",
          duration: "",
          commencement: "",
          courseId: "",
          program: "",
          section: "",
          player1: "",
          player2: "",
          challenges: [
            {
              problemTitle: "",
              problemDescription: "",
              points: 100,
              inputConstraints: ["", "", ""],
              expectedOutput: ["", "", ""],
            },
          ],
          rules: "",
        },
        selectedCourse: null,
        selectedProgram: "",
        selectedSection: "",
        courseValue: "",
        isSubmitting: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error creating battle";
      set({ error: errorMessage, isSubmitting: false });
      toast.error(errorMessage, { id: `battle-error-${Date.now()}` });
      throw error;
    }
  },
  saveBattle: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const state = useBattleStore.getState();

      // Basic form validation
      if (
        !state.battleData.title ||
        !state.battleData.description ||
        !state.battleData.duration ||
        !state.battleData.commencement ||
        !state.battleData.courseId ||
        !state.battleData.program ||
        !state.battleData.section ||
        !state.battleData.player1 ||
        !state.battleData.player2
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate commencement date is in the future
      const commencementDate = new Date(state.battleData.commencement);
      if (commencementDate <= new Date()) {
        throw new Error("Commencement date must be in the future");
      }

      // Validate challenges
      const challenges = state.battleData.challenges;
      for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        if (!challenge.problemTitle.trim() || !challenge.problemDescription.trim()) {
          throw new Error(`Challenge ${i + 1} is missing title or description`);
        }
        if (
          !Array.isArray(challenge.inputConstraints) ||
          !Array.isArray(challenge.expectedOutput) ||
          challenge.inputConstraints.length !== 3 ||
          challenge.expectedOutput.length !== 3 ||
          challenge.inputConstraints.some((input) => !input || input.trim() === "") ||
          challenge.expectedOutput.some((output) => !output || output.trim() === "")
        ) {
          throw new Error(
            `Challenge ${i + 1} must have exactly 3 non-empty input constraints and expected outputs`
          );
        }
        if (!challenge.points || challenge.points <= 0) {
          throw new Error(`Challenge ${i + 1} must have valid points (greater than 0)`);
        }
      }

      const response = await axios.post(`${API_URL}/create`, {
        ...state.battleData,
        status: "pending",
      });
      

      state.addNotification({
        title: `Scheduled Battle: ${state.battleData.title}`,
        message: `You've been selected for an upcoming code battle on ${new Date(state.battleData.commencement).toLocaleString()}`,
        battleCode: response.data.battle.battleCode,
        time: Date.now(), // Add timestamp
      });

      toast.success(`Battle scheduled for ${new Date(state.battleData.commencement).toLocaleString()}!`);
      set({
        battleData: {
          title: "",
          description: "",
          duration: "",
          commencement: "",
          courseId: "",
          program: "",
          section: "",
          player1: "",
          player2: "",
          challenges: [
            {
              problemTitle: "",
              problemDescription: "",
              points: 100,
              inputConstraints: ["", "", ""],
              expectedOutput: ["", "", ""],
            },
          ],
          rules: "",
        },
        selectedCourse: null,
        selectedProgram: "",
        selectedSection: "",
        courseValue: "",
        isSubmitting: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error scheduling battle";
      set({ error: errorMessage, isSubmitting: false });
      toast.error(errorMessage, { id: `battle-error-${Date.now()}` });
      throw error;
    }
  },
});

const createNotificationSlice = (set, get) => ({
  notifications: loadNotificationsFromStorage(),
  unreadNotifications: loadUnreadCountFromStorage(),
  addNotification: (notification) => set((state) => {
    if (state.notifications.some((n) => n.battleCode === notification.battleCode)) {
      console.log(`Notification for battle ${notification.battleCode} already exists`);
      return state;
    }
    // Parse notification.time
    let notificationTime = Number(notification.time);
    if (isNaN(notificationTime)) {
      // Try parsing as ISO string
      const parsedTime = Date.parse(notification.time);
      if (isNaN(parsedTime)) {
        console.warn(
          `Invalid notification.time: ${notification.time}, using current time instead`,
          notification
        );
        notificationTime = Date.now();
      } else {
        notificationTime = parsedTime;
      }
    }
    const newNotification = {
      id: Date.now(),
      type: "challenge",
      title: notification.title || "New Battle Challenge",
      message: notification.message || "You've been selected for a code battle!",
      time: (() => {
        const seconds = Math.floor((Date.now() - notificationTime) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} mn`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        const weeks = Math.floor(days / 7);
        return `${weeks}w`;
      })(),
      read: false,
      battleCode: notification.battleCode,
    };
    console.log("Adding notification:", newNotification);
    const updatedNotifications = [newNotification, ...state.notifications];
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    localStorage.setItem("unreadNotifications", state.unreadNotifications + 1);
    return {
      notifications: updatedNotifications,
      unreadNotifications: state.unreadNotifications + 1,
    };
  }),
  markNotificationAsRead: (notificationId) => set((state) => {
    const updatedNotifications = state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    localStorage.setItem("unreadNotifications", Math.max(0, state.unreadNotifications - 1));
    return {
      notifications: updatedNotifications,
      unreadNotifications: Math.max(0, state.unreadNotifications - 1),
    };
  }),
  dismissNotification: (notificationId) => set((state) => {
    const isUnread = state.notifications.find((n) => n.id === notificationId && !n.read);
    const updatedNotifications = state.notifications.filter((n) => n.id !== notificationId);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    localStorage.setItem(
      "unreadNotifications",
      isUnread ? Math.max(0, state.unreadNotifications - 1) : state.unreadNotifications
    );
    return {
      notifications: updatedNotifications,
      unreadNotifications: isUnread
        ? Math.max(0, state.unreadNotifications - 1)
        : state.unreadNotifications,
    };
  }),
  fetchNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/student`);
      const battles = response.data;
      const newNotifications = battles
        .filter((battle) => battle.status === "pending" || battle.status === "active")
        .map((battle) => ({
          id: Date.now() + Math.random(),
          type: "challenge",
          title: battle.status === "active" ? "New Battle Challenge!" : "Upcoming Battle",
          message: `You've been selected for ${battle.status === "active" ? "an immediate" : "an upcoming"} code battle: ${battle.title}`,
          time: Date.now(), // Use timestamp instead of "Just now"
          read: false,
          battleCode: battle.battleCode,
        }));
      set((state) => {
        const existingCodes = new Set(state.notifications.map((n) => n.battleCode));
        const filteredNotifications = newNotifications.filter((n) => !existingCodes.has(n.battleCode));
        const updatedNotifications = [...filteredNotifications, ...state.notifications];
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        localStorage.setItem("unreadNotifications", state.unreadNotifications + filteredNotifications.length);
        return {
          notifications: updatedNotifications,
          unreadNotifications: state.unreadNotifications + filteredNotifications.length,
        };
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Error loading notifications");
    }
  },
});

const createBattleManagementSlice = (set, get) => ({
  battles: [],
  leaderboard: [],
  isLoadingBattles: false,
  isLoadingLeaderboard: false,
  battlesError: null,
  leaderboardError: null,
  fetchBattles: async () => {
    set({ isLoadingBattles: true, battlesError: null });
    try {
      const response = await axios.get(`${API_URL}/professor`);
      set({ battles: response.data, isLoadingBattles: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching battles";
      set({ battlesError: errorMessage, isLoadingBattles: false });
      toast.error(errorMessage, { id: `battles-error-${Date.now()}` });
    }
  },
  deleteBattle: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        battles: state.battles.filter((battle) => battle.id !== id),
      }));
      toast.success("Battle deleted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting battle";
      toast.error(errorMessage, { id: `delete-error-${Date.now()}` });
      throw error;
    }
  },
  editBattle: async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      set((state) => ({
        battles: state.battles.map((battle) =>
          battle.id === id ? response.data : battle
        ),
      }));
      toast.success("Battle updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating battle";
      toast.error(errorMessage, { id: `edit-error-${Date.now()}` });
      throw error;
    }
  },
  fetchLeaderboard: async () => {
    set({ isLoadingLeaderboard: true, leaderboardError: null });
    try {
      const response = await axios.get(`${API_URL}/leaderboard`);
      set({ leaderboard: response.data, isLoadingLeaderboard: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching leaderboard";
      set({ leaderboardError: errorMessage, isLoadingLeaderboard: false });
      toast.error(errorMessage, { id: `leaderboard-error-${Date.now()}` });
    }
  },
  joinBattle: async (battleCode) => {
    try {
      const response = await axios.post(`${API_URL}/join/${battleCode}`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error joining battle";
      console.error("Join battle error:", errorMessage);
      throw new Error(errorMessage);
    }
  },
});

const useBattleStore = create((set, get) => ({
  ...createBattleSlice(set, get),
  ...createNotificationSlice(set, get),
  ...createBattleManagementSlice(set, get),
}));

export default useBattleStore;