import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  RedirectAuthenticatedInstitution,
  RedirectAuthenticatedStudent,
  ProtectedRouteInstitution,
  ProtectedRouteStudents
} from "./routes/ProtectedRoutes";

// Layouts
import GuestLayout from "./Layout/GuestLayout";
import AdminLayout from "./Layout/AdminLayout";
import StudentLayout from "./Layout/StudentLayout";

// Admin Pages
import AdminLogin from "./pages/admin-view-pages/admin-auth/Admin-Login";
import AdminRegisterPage from "./pages/admin-view-pages/admin-auth/Admin-Register";
import AdminEmailVerificationPage from "./pages/admin-view-pages/admin-auth/Admin-Email-Verification-Page";
import AdminForgotPasswordPage from "./pages/admin-view-pages/admin-auth/Admin-Forgot-Password";
import AdminNewPasswordPage from "./pages/admin-view-pages/admin-auth/Admin-New-Password";
import AdminSuccessResetPage from "./pages/admin-view-pages/admin-auth/Admin-Success-Reset";
import PaymentSummary from "./components/admin-view/payment-summary";
import PaymentSuccess from "./components/admin-view/payment-success";
import AdminDashboard from "./pages/admin-view-pages/Main-Dashboard";
import ProfessorList from "./pages/admin-view-pages/admin-professor/Professor";
import AddProfessor from "./pages/admin-view-pages/admin-professor/Add-Professor";
import StudentList from "./pages/admin-view-pages/admin-student/Student";
import AddStudent from "./pages/admin-view-pages/admin-student/Add-Student";


// Professor Pages
import ProfessorLogin from "./pages/professor-view-pages/professor-auth/Professor-Login";
import ProfForgotPassword from "./pages/professor-view-pages/professor-auth/Professor-Forgot-Password";
import ProfNewPassword from "./pages/professor-view-pages/professor-auth/Professor-New-Password";
import ProfSuccessPassword from "./pages/professor-view-pages/professor-auth/Professor-Success-Password";


// Student Pages
import StudentLoginPage from "./pages/student-view-pages/auth/Student-Login";
import StudentForgotPasswordPage from "./pages/student-view-pages/auth/Student-Forgot-Password";
import StudentNewPasswordPage from "./pages/student-view-pages/auth/Student-New-Password";
import StudentDashboard from "./pages/student-view-pages/Dashboard";
import StudentCourseListPage from "./pages/student-view-pages/course-management/student-course-list";
import StudentChallengesView from "./pages/student-view-pages/challenges/student-challenges-view";
import StudentLessonListPage from "./pages/student-view-pages/course-management/student-lesson-list";
import StudentPracticePage from "./pages/student-view-pages/challenges/student-practice-page";
import StudentModulePage from "./pages/student-view-pages/course-management/student-module";
import StudentActivityPage from "./pages/student-view-pages/course-management/student-activity";
import StudentPracticePage from "./pages/student-view-pages/challenges/student-practice-page";
import StudentCalendarPage from "./pages/student-view-pages/Schedule-Calendar";

import CodeEditor from "./components/CodeEditor";
import LandingPage from "./pages/Guest-view-pages/Landing-page";
import MainLogin from "./pages/Guest-view-pages/Login";
import PageNotFoundPage from "./pages/Guest-view-pages/NotFound";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<MainLogin />} />
          <Route path="*" element={<PageNotFoundPage />} />

          {/* Admin Registration & Authentication */}
          <Route path="/admin/register" element={
            <RedirectAuthenticatedInstitution>
              <AdminRegisterPage />
            </RedirectAuthenticatedInstitution>
          } />
          <Route path="/admin/login" element={
            <RedirectAuthenticatedInstitution>
              <AdminLogin />
            </RedirectAuthenticatedInstitution>
          } />
          <Route path="/admin/forgot-password" element={
            <RedirectAuthenticatedInstitution>
              <AdminForgotPasswordPage />
            </RedirectAuthenticatedInstitution>
          } />
          <Route path="/admin/reset-password/:token" element={
            <RedirectAuthenticatedInstitution>
              <AdminNewPasswordPage />
            </RedirectAuthenticatedInstitution>
          } />
          <Route path="/admin/success-reset" element={<AdminSuccessResetPage />} />
        

        {/* Student Authentication */}
        <Route path="/student/login" element={
          <RedirectAuthenticatedStudent>
            <StudentLoginPage />
          </RedirectAuthenticatedStudent>
        } />
        <Route path="/student/forgot-password" element={
          <RedirectAuthenticatedStudent>
            <StudentForgotPasswordPage />
          </RedirectAuthenticatedStudent>
        } />
        <Route path="/student/reset-password/:token" element={
          <RedirectAuthenticatedStudent>
            <StudentNewPasswordPage />
          </RedirectAuthenticatedStudent>
        } />

        {/* Professor Authentication */}
        <Route path="/professor/login" element={<ProfessorLogin />} />
        <Route path="/professor/forgot-password" element={<ProfForgotPassword />} />
        <Route path="/professor/reset-password/:token" element={<ProfNewPassword />} />
        <Route path="/professor/success-reset" element={<ProfSuccessPassword />} />

        <Route path="admin/email-verify" element={
          <ProtectedRouteInstitution>
            <AdminEmailVerificationPage />
          </ProtectedRouteInstitution>
        } />

        <Route path="admin/payment-summary" element={
          <ProtectedRouteInstitution>
            <PaymentSummary />
          </ProtectedRouteInstitution>
        } />

        <Route path="admin/payment-success" element={
          <ProtectedRouteInstitution>
            <PaymentSuccess />
          </ProtectedRouteInstitution>
        } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/" element={<AdminLayout />}>
          <Route path="dashboard" element={<ProtectedRouteInstitution><AdminDashboard /></ProtectedRouteInstitution>} />
          <Route path="professors" element={<ProtectedRouteInstitution><ProfessorList /></ProtectedRouteInstitution>} />
          <Route path="addProfessor" element={<ProtectedRouteInstitution><AddProfessor /></ProtectedRouteInstitution>} />
          <Route path="students" element={<ProtectedRouteInstitution><StudentList /></ProtectedRouteInstitution>} />
          <Route path="addStudent" element={<ProtectedRouteInstitution><AddStudent /></ProtectedRouteInstitution>} />
        </Route>



        {/* Additional Routes */}
        <Route path="/code-editor" element={<CodeEditor />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
