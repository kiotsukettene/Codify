import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

axios.defaults.withCredentials = true;

const useBattleStore = create((set) => ({
  // Form data
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

  // UI state
  selectedCourse: null,
  selectedProgram: "",
  selectedSection: "",
  open: false,
  courseValue: "",
  isSubmitting: false,
  error: null,

  // New state for battles and leaderboard
  battles: [],
  leaderboard: [],
  isLoadingBattles: false,
  isLoadingLeaderboard: false,
  battlesError: null,
  leaderboardError: null,

  // Actions
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
    newChallenges[index] = {
      ...newChallenges[index],
      [field]: value,
    };
    return {
      battleData: {
        ...state.battleData,
        challenges: newChallenges,
      },
    };
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
        program,
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
        section,
        player1: "",
        player2: "",
      },
    };
  }),

  setOpen: (value) => set({ open: value }),

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

  submitBattle: async () => {
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
        status: "active",
        commencement: new Date().toISOString(), // Override commencement to now
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

  getAvailablePlayers: (currentPlayerId) => (state) => {
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

  removeChallenge: (index) => set((state) => {
    if (state.battleData.challenges.length > 1) {
      const updatedChallenges = state.battleData.challenges.filter((_, i) => i !== index);
      return {
        battleData: {
          ...state.battleData,
          challenges: updatedChallenges,
        },
      };
    }
    return state;
  }),

  // Fetch battles
  fetchBattles: async () => {
    set({ isLoadingBattles: true, battlesError: null });
    try {
      const response = await axios.get(`${API_URL}/professor`);
      set({
        battles: response.data,
        isLoadingBattles: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching battles";
      set({
        battlesError: errorMessage,
        isLoadingBattles: false,
      });
      toast.error(errorMessage, { id: `battles-error-${Date.now()}` });
    }
  },

  // Delete battle
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

  // Edit battle
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

  // Fetch leaderboard
  fetchLeaderboard: async () => {
    set({ isLoadingLeaderboard: true, leaderboardError: null });
    try {
      const response = await axios.get(`${API_URL}/leaderboard`);
      set({
        leaderboard: response.data,
        isLoadingLeaderboard: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching leaderboard";
      set({
        leaderboardError: errorMessage,
        isLoadingLeaderboard: false,
      });
      toast.error(errorMessage, { id: `leaderboard-error-${Date.now()}` });
    }
  },
}));



export default useBattleStore;