import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  RedirectAuthenticatedInstitution,
  RedirectAuthenticatedStudent,
  ProtectedRouteInstitution,
  ProtectedRouteStudents,
  RedirectAuthenticatedProfessor,
  ProtectedRouteProfessors,
  RestrictPublicRoutes,
  ProtectedRouteStudentOrProfessor,
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
import CoursesAdmin from "./pages/admin-view-pages/courses";

// Professor Pages
import { useprofAuthStore } from "@/store/profAuthStore";
import ProfessorLogin from "./pages/professor-view-pages/professor-auth/Professor-Login";
import ProfForgotPassword from "./pages/professor-view-pages/professor-auth/Professor-Forgot-Password";
import ProfNewPassword from "./pages/professor-view-pages/professor-auth/Professor-New-Password";
import ProfSuccessPassword from "./pages/professor-view-pages/professor-auth/Professor-Success";
import LessonOverview from "./pages/professor-view-pages/Course-management/Lesson-Overview";
import Courses from "./pages/professor-view-pages/Course-management/Course";
import ProfDashboard from "./pages/professor-view-pages/ProfDashboard";
import ActivityPage from "./pages/professor-view-pages/Course-management/Activity-Page";
import CreateActivity from "./pages/professor-view-pages/Course-management/Create-Activity";
import CreateLesson from "./pages/professor-view-pages/Course-management/Create-Lesson";
import Topic from "./pages/professor-view-pages/Course-management/Topic";
import CodeBattleOverview from "./pages/professor-view-pages/Code-Battle/Code-Battle-Overview";
import CreateBattle from "./pages/professor-view-pages/Code-Battle/Create-Battle";
import Account from "./pages/professor-view-pages/Professor-Account";
import CodeBattle from "./pages/professor-view-pages/Code-Battle/Code-Battle";
import EditActivity from "./pages/professor-view-pages/Course-management/Edit-Activity";

// Student Pages
import StudentLoginPage from "./pages/student-view-pages/auth/Student-Login";
import StudentForgotPasswordPage from "./pages/student-view-pages/auth/Student-Forgot-Password";
import StudentNewPasswordPage from "./pages/student-view-pages/auth/Student-New-Password";
import StudentDashboard from "./pages/student-view-pages/Dashboard";
import StudentCourseListPage from "./pages/student-view-pages/course-management/student-course-list";
import StudentChallengesView from "./pages/student-view-pages/challenges/student-challenges-view";
import StudentLessonListPage from "./pages/student-view-pages/course-management/student-lesson-list";
import StudentTaskPage from "./pages/student-view-pages/Task-Activity-list";
import StudentModulePage from "./pages/student-view-pages/course-management/student-module";
import StudentActivityPage from "./pages/student-view-pages/course-management/student-activity";
import StudentPracticePage from "./pages/student-view-pages/challenges/student-practice-page";
import StudentCalendarPage from "./pages/student-view-pages/Schedule-Calendar";

import CodeEditor from "./components/CodeEditor";
import LandingPage from "./pages/Guest-view-pages/Landing-page";
import MainLogin from "./pages/Guest-view-pages/Login";
import PageNotFoundPage from "./pages/Guest-view-pages/NotFound";
import StudentAccountSettings from "./pages/student-view-pages/Student-Account-Setting";
import VideoConference from "./pages/student-view-pages/Video-Conference";
import { useStudentStore } from "@/store/studentStore";
import ContactUsPage from "./pages/Guest-view-pages/Contact-Us";
import ProfessorLayout from "./Layout/ProfessorLayout";
import StudentCodeBattleOverview from "./pages/student-view-pages/code-battle/student-codeBattle-overview";
import ArenaDashboardPage from "./pages/student-view-pages/code-battle/arena-dashboard";
import MainArena from "./pages/student-view-pages/code-battle/main-arena";
import TermsAndCondition from "./pages/Guest-view-pages/Terms-and-condition";


function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const { checkStudentAuth, isCheckingStudentAuth } = useStudentStore();
  const { checkProfAuth, isCheckingProfAuth } = useprofAuthStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Run auth checks only on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      await Promise.all([checkAuth(), checkStudentAuth(), checkProfAuth()]);
      setIsInitialLoad(false); // Mark initial load as complete
    };
    initializeAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Show spinner only during initial load when auth is being checked
  if (
    isInitialLoad &&
    (isCheckingAuth || isCheckingStudentAuth || isCheckingProfAuth)
  ) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <Routes>  
        <Route path="/battle" element={<CodeBattle />} />
        <Route path="/terms" element={<TermsAndCondition />} />
        <Route path="/payment-success" element={<ProtectedRouteInstitution><PaymentSuccess/></ProtectedRouteInstitution>} />
        {/* Public Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route
            index
            element={
              <RestrictPublicRoutes>
                <LandingPage />
              </RestrictPublicRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <RestrictPublicRoutes>
                <MainLogin />
              </RestrictPublicRoutes>
            }
          />
          <Route path="*" element={<PageNotFoundPage />} />
          <Route
            path="/contact"
            element={
              <RestrictPublicRoutes>
                <ContactUsPage />
              </RestrictPublicRoutes>
            }
          />
          {/* Admin Registration & Authentication */}
          <Route
            path="/admin/register"
            element={
              <RedirectAuthenticatedInstitution>
                <AdminRegisterPage />
              </RedirectAuthenticatedInstitution>
            }
          />
          <Route
            path="/admin/login"
            element={
              <RedirectAuthenticatedInstitution>
                <AdminLogin />
              </RedirectAuthenticatedInstitution>
            }
          />
          <Route
            path="/admin/email-verify"
            element={
              <ProtectedRouteInstitution>
                <AdminEmailVerificationPage />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="/admin/payment-summary"
            element={
              <ProtectedRouteInstitution>
                <PaymentSummary />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="/admin/forgot-password"
            element={
              <RedirectAuthenticatedInstitution>
                <AdminForgotPasswordPage />
              </RedirectAuthenticatedInstitution>
            }
          />
          <Route
            path="/admin/reset-password/:token"
            element={
              <RedirectAuthenticatedInstitution>
                <AdminNewPasswordPage />
              </RedirectAuthenticatedInstitution>
            }
          />
          <Route
            path="/admin/success-reset"
            element={<AdminSuccessResetPage />}
          />
          {/* Student Authentication */}
          <Route
            path="/student/login"
            element={
              <RedirectAuthenticatedStudent>
                <StudentLoginPage />
              </RedirectAuthenticatedStudent>
            }
          />
          <Route
            path="/student/forgot-password"
            element={
              <RedirectAuthenticatedStudent>
                <StudentForgotPasswordPage />
              </RedirectAuthenticatedStudent>
            }
          />
          <Route
            path="/student/reset-password/:token"
            element={
              <RedirectAuthenticatedStudent>
                <StudentNewPasswordPage />
              </RedirectAuthenticatedStudent>
            }
          />

          <Route
            path="/professor/login"
            element={
              <RedirectAuthenticatedProfessor>
                <ProfessorLogin />
              </RedirectAuthenticatedProfessor>
            }
          />
          <Route
            path="/professor/forgot-password"
            element={
              <RedirectAuthenticatedProfessor>
                <ProfForgotPassword />
              </RedirectAuthenticatedProfessor>
            }
          />
          <Route
            path="/professor/reset-password/:token"
            element={
              <RedirectAuthenticatedProfessor>
                <ProfNewPassword />
              </RedirectAuthenticatedProfessor>
            }
          />
          <Route
            path="/professor/success-reset"
            element={<ProfSuccessPassword />}
          />
        </Route>

        {/* Professor Authentication */}

        <Route path="/professor/" element={<ProfessorLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRouteProfessors>
                <ProfDashboard />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course"
            element={
              <ProtectedRouteProfessors>
                <Courses />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug"
            element={
              <ProtectedRouteProfessors>
                <LessonOverview />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug/create-lesson"
            element={
              <ProtectedRouteProfessors>
                <CreateLesson />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug/lesson/:lessonSlug"
            element={
              <ProtectedRouteProfessors>
                <Topic />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug/lesson/:lessonSlug/create-activity"
            element={
              <ProtectedRouteProfessors>
                <CreateActivity />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug/lesson/:lessonSlug/activity/:activitySlug"
            element={
              <ProtectedRouteProfessors>
                <ActivityPage />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="course/:courseSlug/lesson/:lessonSlug/activity/:activitySlug/edit"
            element={<EditActivity />}
          />
          <Route
            path="reset-password/:token"
            element={
              <RedirectAuthenticatedProfessor>
                <ProfNewPassword />
              </RedirectAuthenticatedProfessor>
            }
          />
          <Route
            path="code-battle"
            element={
              <ProtectedRouteProfessors>
                <CodeBattleOverview />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="code-battle/create"
            element={
              <ProtectedRouteProfessors>
                <CreateBattle />
              </ProtectedRouteProfessors>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRouteProfessors>
                <Account />
              </ProtectedRouteProfessors>
            }
          />
        </Route>

        {/* Authenticated Admin Routes */}
        <Route path="/admin/" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRouteInstitution>
                <AdminDashboard />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="professors"
            element={
              <ProtectedRouteInstitution>
                <ProfessorList />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="addProfessor"
            element={
              <ProtectedRouteInstitution>
                <AddProfessor />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="students"
            element={
              <ProtectedRouteInstitution>
                <StudentList />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="addStudent"
            element={
              <ProtectedRouteInstitution>
                <AddStudent />
              </ProtectedRouteInstitution>
            }
          />
          <Route
            path="courses"
            element={
              <ProtectedRouteInstitution>
                <CoursesAdmin />
              </ProtectedRouteInstitution>
            }
          />
        </Route>

        {/* Student Routes */}
        <Route path="/student/" element={<StudentLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRouteStudents>
                <StudentDashboard />
              </ProtectedRouteStudents>
            }
          />
          <Route
            path="course-list"
            element={
              <ProtectedRouteStudents>
                <StudentCourseListPage />
              </ProtectedRouteStudents>
            }
          />
          <Route
            path="challenges"
            element={
              <ProtectedRouteStudents>
                <StudentChallengesView />
              </ProtectedRouteStudents>
            }
          />
          <Route
            path="challenges/:id"
            element={
              <ProtectedRouteStudents>
                <StudentPracticePage />
              </ProtectedRouteStudents>
            }
          />
          <Route
            path="lesson-list/:courseId"
            element={
              <ProtectedRouteStudents>
                <StudentLessonListPage />
              </ProtectedRouteStudents>
            }
          />
          <Route path="module/:lessonId" element={<StudentModulePage />} />
          <Route
            path="/student/activity/:activitySlug"
            element={<StudentActivityPage />}
          />
          <Route path="task-list" element={<StudentTaskPage />} />
          <Route path="schedules" element={<StudentCalendarPage />} />
          <Route path="account-settings" element={<StudentAccountSettings />} />
          <Route path="code-battle" element={<StudentCodeBattleOverview />} />
          {/* <Route path="code-editor" element={<ProtectedRouteStudents><CodeEditor /></ProtectedRouteStudents>} /> */}
        </Route>

        <Route path="/arena-dashboard" element={<ArenaDashboardPage />} />
        <Route path="/main-arena" element={<MainArena />} />

        {/* Additional Routes */}

        <Route path="/video-conference" element={<VideoConference />} />
        <Route
          path="/code-editor"
          element={
            <ProtectedRouteStudentOrProfessor>
              <CodeEditor />
            </ProtectedRouteStudentOrProfessor>
          }
        />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
