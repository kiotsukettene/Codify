import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const isDev = import.meta.env.MODE === 'development';
const API_URL = isDev
  ? 'http://localhost:3000/api/battles'
  : `${import.meta.env.VITE_API_URL}/api/battles`;

axios.defaults.withCredentials = true;

const useBattleStore = create((set) => ({
  // Form data
  battleData: {
    title: '',
    description: '',
    duration: '',
    commencement: '',
    courseId: '',
    program: '',
    section: '',
    player1: '',
    player2: '',
    challenges: [{
      problemTitle: '',
      problemDescription: '',
      inputConstraints: '',
      expectedOutput: '',
    }],
    rules: '',
  },

  // UI state
  selectedCourse: null,
  selectedProgram: '',
  selectedSection: '',
  open: false,
  courseValue: '',
  isSubmitting: false,
  error: null,

  // Actions
  setBattleData: (updates) => set((state) => ({
    battleData: { ...state.battleData, ...updates },
  })),

  addChallenge: () => set((state) => ({
    battleData: {
      ...state.battleData,
      challenges: [...state.battleData.challenges, {
        problemTitle: '',
        problemDescription: '',
        inputConstraints: '',
        expectedOutput: '',
      }],
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
    // Deduplicate courses by className
    const uniqueCourses = courses.reduce((acc, course) => {
      const existing = acc.find((c) => c.className === course.className);
      if (!existing) {
        acc.push({
          _id: course._id,
          className: course.className,
          programs: [course.program].filter(Boolean), // Aggregate programs
          sections: [course.section].filter(Boolean), // Aggregate sections
          studentsEnrolled: course.studentsEnrolled || [],
        });
      } else {
        existing.programs.push(course.program);
        existing.sections.push(course.section);
        existing.studentsEnrolled = [
          ...existing.studentsEnrolled,
          ...(course.studentsEnrolled || []),
        ].filter((student, index, self) =>
          index === self.findIndex((s) => s._id === student._id)
        ); // Deduplicate students
      }
      return acc;
    }, []);

    const course = uniqueCourses.find((c) => c._id === courseId);
    if (!course) return state;

    return {
      courseValue: courseId,
      selectedCourse: {
        id: course._id,
        name: course.className,
        programs: [...new Set(course.programs.filter(Boolean))], // Unique programs
        sections: [...new Set(course.sections.filter(Boolean))], // Unique sections
        students: course.studentsEnrolled.map((student) => ({
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
        })),
      },
      selectedProgram: '',
      selectedSection: '',
      battleData: {
        ...state.battleData,
        courseId,
        program: '',
        section: '',
        player1: '',
        player2: '',
      },
    };
  }),

  selectProgram: (program) => set((state) => {
    if (!state.selectedCourse) return state;
    return {
      selectedProgram: program,
      selectedSection: '',
      battleData: {
        ...state.battleData,
        program,
        section: '',
        player1: '',
        player2: '',
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
        player1: '',
        player2: '',
      },
    };
  }),

  setOpen: (value) => set({ open: value }),

  submitBattle: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/create`, useBattleStore.getState().battleData);
      toast.success('Battle created successfully!');
      set({
        battleData: {
          title: '',
          description: '',
          duration: '',
          commencement: '',
          courseId: '',
          program: '',
          section: '',
          player1: '',
          player2: '',
          challenges: [{
            problemTitle: '',
            problemDescription: '',
            inputConstraints: '',
            expectedOutput: '',
          }],
          rules: '',
        },
        selectedCourse: null,
        selectedProgram: '',
        selectedSection: '',
        courseValue: '',
        isSubmitting: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating battle';
      set({ error: errorMessage, isSubmitting: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  getAvailablePlayers: (currentPlayerId) => (state) => {
    if (!state.selectedCourse || !state.selectedProgram || !state.selectedSection) return [];
    // Filter students by section (assuming students are enrolled in specific sections)
    const students = state.selectedCourse.students.filter((student) => {
      // This is a simplified check; adjust based on your data structure
      return true; // Placeholder; replace with actual section filtering logic if available
    });
    if (currentPlayerId === 'player1') {
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
}));

export default useBattleStore;