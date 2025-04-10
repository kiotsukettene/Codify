import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";
import { useprofAuthStore } from "@/store/profAuthStore";

// Prevents authenticated users from accessing public routes
export const RestrictPublicRoutes = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();
  const location = useLocation();

  // Allow access to the fallback route (404)
  if (location.pathname === "*") {
    return children;
  }

  if (isAuthenticated) {
    if (!institution?.isVerified) return <Navigate to="/admin/email-verify" replace />;
    if (!institution?.isPaid) return <Navigate to="/admin/payment-summary" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isStudentAuthenticated) {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (isProfessorAuthenticated) {
    return <Navigate to="/professor/dashboard" replace />;
  }

  return children;
};

// RedirectAuthenticatedInstitution (unchanged)
export const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const location = useLocation();

  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated) {
    if (!institution?.isVerified) return <Navigate to="/admin/email-verify" replace />;
    if (!institution?.isPaid) return <Navigate to="/admin/payment-summary" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isStudentAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export const ProtectedRouteStudentOrProfessor = ({ children }) => {
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();

  if (!isStudentAuthenticated && !isProfessorAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// RedirectAuthenticatedStudent (unchanged)
export const RedirectAuthenticatedStudent = ({ children }) => {
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isStudentAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return isStudentAuthenticated ? <Navigate to="/student/dashboard" replace /> : children;
};

// RedirectAuthenticatedProfessor (unchanged)
export const RedirectAuthenticatedProfessor = ({ children }) => {
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isProfessorAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/professor/dashboard" replace />;
  }

  if (isAuthenticated && location.pathname.startsWith("/professor")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return isProfessorAuthenticated ? <Navigate to="/professor/dashboard" replace /> : children;
};

// ProtectedRouteInstitution (unchanged)
export const ProtectedRouteInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (institution.isVerified && location.pathname === "/admin/email-verify") {
    return <Navigate to="/admin/payment-summary" replace />;
  }

  if (institution.isPaid && location.pathname === "/admin/payment-summary") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// ProtectedRouteStudents (unchanged)
export const ProtectedRouteStudents = ({ children }) => {
  const { isAuthenticated } = useStudentStore();

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
};

// ProtectedRouteProfessors (unchanged)
export const ProtectedRouteProfessors = ({ children }) => {
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();

  return isProfessorAuthenticated ? children : <Navigate to="/professor/login" replace />;
};