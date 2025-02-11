import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore"; // Admin authentication
import { useStudentStore } from "@/store/studentStore"; // Student authentication

const ProtectedRoute = ({ allowedRoles }) => {
  const { institution, isAuthenticated: isAdminAuthenticated } = useAuthStore(); // Admin user
  const { student, isAuthenticated: isStudentAuthenticated } = useStudentStore(); // Student user

  // Determine if the user is logged in
  const currentUser = institution || student;
  const isAuthenticated = isAdminAuthenticated || isStudentAuthenticated;
  const role = currentUser?.role;

  // If no user is logged in, redirect to login page
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/student-login" replace />;
  }

  // If the role is not allowed, redirect them away
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render the protected page
};

export default ProtectedRoute;
