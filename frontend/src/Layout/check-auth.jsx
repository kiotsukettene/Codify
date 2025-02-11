import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore(); // Admin & Professors
  const { isStudentAuthenticated, student } = useStudentStore(); // Students

  let currentUser = user || student;
  let isAuthenticatedUser = isAuthenticated || isStudentAuthenticated;

  // ✅ If the user is authenticated, redirect to their respective dashboard
  if (isAuthenticatedUser && currentUser) {
    if (currentUser.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (currentUser.role === "professor") return <Navigate to="/professor/dashboard" replace />;
  }

  return children; // ✅ Allow access if not authenticated
};

export default RedirectIfAuthenticated;
