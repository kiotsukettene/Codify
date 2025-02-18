import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";

// ✅ Prevents authenticated admins from accessing student login & vice versa
export const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const location = useLocation();

  // 🚫 Prevent admin from accessing student login pages
  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated) {
    if (!institution.isVerified) return <Navigate to="/admin/email-verify" replace />;
    if (!institution.isPaid) return <Navigate to="/admin/payment-summary" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 🚫 Prevent student from accessing admin login pages
  if (isStudentAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

// ✅ Prevents authenticated students from accessing admin login & vice versa
export const RedirectAuthenticatedStudent = ({ children }) => {
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // 🚫 Prevent student from accessing admin login pages
  if (isStudentAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // 🚫 Prevent admin from accessing student login pages
  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return isStudentAuthenticated ? <Navigate to="/student/dashboard" replace /> : children;
};

// ✅ Protects institution-related routes (Admin)
export const ProtectedRouteInstitution = () => {
  const { isAuthenticated, institution } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!institution.isVerified && location.pathname !== "/admin/email-verify") 
    return <Navigate to="/admin/email-verify" replace />;
  if (!institution.isPaid && location.pathname !== "/admin/payment-summary") 
    return <Navigate to="/admin/payment-summary" replace />;

  return <Outlet />;
};

// ✅ Protects student-related routes
export const ProtectedRouteStudents = () => {
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  return isStudentAuthenticated ? <Outlet /> : <Navigate to="/student/login" replace />;
};
