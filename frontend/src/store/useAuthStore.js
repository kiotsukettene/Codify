//for proper routing sana HAHAHAHAH

import { create } from "zustand";

import { checkAuth as checkProfessorAuth } from "../store/profAuthStore";

const useAuthStoreRoute = create((set) => ({
  isAuthenticated: false,
  user: null,
  role: null,
  isCheckingAuth: false,
  error: null,

  checkProfessorAuth: () => checkProfessorAuth(set),

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      role: null,
    });
  },
}));

export default useAuthStoreRoute;
