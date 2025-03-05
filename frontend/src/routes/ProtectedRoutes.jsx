import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useNavigate } from "react-router-dom";

// ✅ Prevents authenticated admins from accessing student login & vice versa
export const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const location = useLocation();

  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated) {
    if (!institution?.isVerified)
      return <Navigate to="/admin/email-verify" replace />;
    if (!institution?.isPaid)
      return <Navigate to="/admin/payment-summary" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

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

  if (isStudentAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (isAuthenticated && location.pathname.startsWith("/student")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return isStudentAuthenticated ? (
    <Navigate to="/student/dashboard" replace />
  ) : (
    children
  );
};

export const RedirectAuthenticatedProfessor = ({ children }) => {
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();
  const { isAuthenticated } = useAuthStore(); // Assuming there's a store for admin authentication
  const location = useLocation();

  if (isProfessorAuthenticated && location.pathname.startsWith("/admin")) {
    return <Navigate to="/professor/dashboard" replace />;
  }

  if (isAuthenticated && location.pathname.startsWith("/professor")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return isProfessorAuthenticated ? (
    <Navigate to="/professor/dashboard" replace />
  ) : (
    children
  );
};

// ✅ Fix: Prevent infinite re-renders in ProtectedRouteInstitution
export const ProtectedRouteInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If already verified, prevent access to /email-verify
  if (
    institution.isVerified &&
    window.location.pathname === "/admin/email-verify"
  ) {
    return <Navigate to="/admin/payment-summary" replace />;
  }

  if (
    institution.isPaid &&
    window.location.pathname === "/admin/payment-summary"
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// ✅ Fix: Prevent infinite re-renders in ProtectedRouteStudents
export const ProtectedRouteStudents = ({ children }) => {
  const { isAuthenticated, checkStudentAuth } = useStudentStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkStudentAuth();
    if (!isAuthenticated) navigate("/student/login");
  }, [isAuthenticated, checkStudentAuth, navigate]);

  return isAuthenticated ? children : null;
};

export const ProtectedRouteProfessors = ({ children }) => {
  const { isAuthenticated } = useprofAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/professor/login" replace />;
  }
  return children;
};
