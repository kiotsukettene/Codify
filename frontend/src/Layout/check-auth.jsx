import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";
import { useprofAuthStore } from "@/store/profAuthStore";

const RedirectIfAuthenticated = ({ children }) => {
  const { institution, isAuthenticated: isAdminAuthenticated } = useAuthStore();
  const { student, isAuthenticated: isStudentAuthenticated } =
    useStudentStore();
  const { professor, isAuthenticated: isProfessorAuthenticated } =
    useprofAuthStore();

  const isAuthenticatedUser =
    isAdminAuthenticated || isStudentAuthenticated || isProfessorAuthenticated;
  const currentUser = institution || student || professor;
  const role = currentUser?.role;

  // Redirect users based on their role
  if (isAuthenticatedUser && currentUser) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "professor")
      return <Navigate to="/professor/dashboard" replace />;
    if (role === "student") return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
