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
  ProtectedRouteStudents,
  RedirectAuthenticatedProfessor,
  ProtectedRouteProfessors,
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
import { useprofAuthStore } from "@/store/profAuthStore";
import ProfessorLogin from "./pages/professor-view-pages/professor-auth/Professor-Login";
import ProfForgotPassword from "./pages/professor-view-pages/professor-auth/Professor-Forgot-Password";
import ProfNewPassword from "./pages/professor-view-pages/professor-auth/Professor-New-Password";


import LessonOverview from "./pages/professor-view-pages/Course-management/Lesson-Overview";
import Courses from "./pages/professor-view-pages/Course-management/Course";
import ProfDashboard from "./pages/professor-view-pages/ProfDashboard";
import ActivityPage from "./pages/professor-view-pages/Course-management/Activity-Page";
import CreateActivity from "./pages/professor-view-pages/Course-management/Create-Activity";
import CreateLesson from "./pages/professor-view-pages/Course-management/Create-Lesson";
import Topic from "./pages/professor-view-pages/Course-management/Topic";

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
<<<<<<< HEAD
=======
import VideoConference from "./pages/student-view-pages/Video-Conference";
// redirect authenticated and paid institution to dashboard page 

const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  

  if (isAuthenticated && institution.isVerified && institution.isPaid) {
    return <Navigate to="/admin/dashboard" replace/>;
  }

  if (isAuthenticated && institution.isVerified && !institution.isPaid) {
    return <Navigate to="/admin/payment-summary" replace/>;
  }
  
  if (isAuthenticated && !institution.isVerified && !institution.isPaid) { 
    return <Navigate to="/admin/email-verify" replace/>;
  }


  return children;
}

const RedirectAuthenticatedStudent = ({ children }) => {
  const { isAuthenticated } = useStudentStore();
  

  if (isAuthenticated) {
    return <Navigate to="/student/dashboard" replace/>;
  }

  return children;
}

// protect routes that require authentication

const ProtectedRouteInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }


  // If already verified, prevent access to /email-verify
  if (institution.isVerified && window.location.pathname === "/admin/email-verify") {
    return <Navigate to="/admin/payment-summary" replace />;
  }

  if (institution.isPaid && window.location.pathname === "/admin/payment-summary") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

const ProtectedRouteStudents = ({ children }) => {
  const { isAuthenticated } = useStudentStore();

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
}
>>>>>>> feature/FE-video-conference

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
        <Route path="/professor/courses" element={<LessonOverview />} />

<<<<<<< HEAD
        {/* Public Routes */}
=======
     

        <Route path="/student/login" element={
          <RedirectAuthenticatedStudent>
            <StudentLoginPage/>
          </RedirectAuthenticatedStudent>
        } />

        <Route path="/student/forgot-password" element={
          <RedirectAuthenticatedStudent>
            <StudentForgotPasswordPage/>
          </RedirectAuthenticatedStudent>
        } />
        
        <Route path="/student/reset-password/:token" element={<RedirectAuthenticatedStudent><StudentNewPasswordPage /></RedirectAuthenticatedStudent>} />

       <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={
            <ProtectedRouteStudents>
            <StudentDashboard />
            </ProtectedRouteStudents>
            } />
          {/* <Route path="course-list" element={
            <ProtectedRouteStudents>
               <StudentCourseListPage />
            </ProtectedRouteStudents>  
          } /> */}

          <Route path="course-list" element={<StudentCourseListPage/>}/>
          <Route path="lesson-list" element={<StudentLessonListPage/>}/>
          <Route path="module" element={<StudentModulePage/>}/>
          <Route path="activity" element={<StudentActivityPage/>}/>
          <Route path="task-list" element={<StudentTaskPage/>}/>
          <Route path="challenges" element={<StudentChallengesView/>}/>
          <Route path="practice" element={<StudentPracticePage/>}/>
          <Route path="schedules" element={<StudentCalendarPage/>}/>
    </Route>
    
    <Route path="/video-conference" element={<VideoConference/>}/>
        
>>>>>>> feature/FE-video-conference
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<MainLogin />} />
          <Route path="*" element={<PageNotFoundPage />} />
          {/* Admin Registration & Authentication */}
          <Route path="/admin/register" element={<RedirectAuthenticatedInstitution><AdminRegisterPage /></RedirectAuthenticatedInstitution>} />
          <Route path="/admin/login" element={<RedirectAuthenticatedInstitution><AdminLogin /></RedirectAuthenticatedInstitution>} />
          <Route path="/admin/forgot-password" element={<RedirectAuthenticatedInstitution><AdminForgotPasswordPage /></RedirectAuthenticatedInstitution>} />
          <Route path="/admin/reset-password/:token" element={<RedirectAuthenticatedInstitution><AdminNewPasswordPage /></RedirectAuthenticatedInstitution>} />
          <Route path="/admin/success-reset" element={<AdminSuccessResetPage />} />
           {/* Student Authentication */}
          <Route path="/student/login" element={<RedirectAuthenticatedStudent><StudentLoginPage /></RedirectAuthenticatedStudent>}/>
          <Route path="/student/forgot-password" element={<RedirectAuthenticatedStudent><StudentForgotPasswordPage /></RedirectAuthenticatedStudent>}/>
          <Route path="/student/reset-password/:token" element={<RedirectAuthenticatedStudent><StudentNewPasswordPage /></RedirectAuthenticatedStudent>} />
          
          <Route path="/professor/login" element={<RedirectAuthenticatedProfessor><ProfessorLogin /></RedirectAuthenticatedProfessor>} />
          <Route path="/professor/forgot-password" element={<RedirectAuthenticatedProfessor><ProfForgotPassword /></RedirectAuthenticatedProfessor>} />
          <Route path="/professor/reset-password/:token" element={<RedirectAuthenticatedProfessor><ProfNewPassword /></RedirectAuthenticatedProfessor>} />

        </Route>

        {/* Professor Authentication */}
        <Route path="/professor/" >
          
          <Route path="dashboard" element={<ProtectedRouteProfessors><ProfDashboard /></ProtectedRouteProfessors>} />
          <Route path="course" element={<ProtectedRouteProfessors><Courses /></ProtectedRouteProfessors>} />
          <Route path="course/:courseId" element={<ProtectedRouteProfessors><LessonOverview /></ProtectedRouteProfessors>} />
          <Route path="course/:courseId/create-lesson" element={<ProtectedRouteProfessors><CreateLesson /></ProtectedRouteProfessors>} />
          <Route path="course/:courseId/lesson/:lessonId" element={<ProtectedRouteProfessors><Topic /></ProtectedRouteProfessors>} />
          <Route path="course/:courseId/lesson/:lessonId/create-activity" element={<ProtectedRouteProfessors><CreateActivity /></ProtectedRouteProfessors>} />
          <Route path="course/:courseId/lesson/:lessonId/activity/:activityId" element={<ProtectedRouteProfessors><ActivityPage /></ProtectedRouteProfessors>} />
    
        </Route>

        {/* Authenticated Admin Routes */}
        <Route path="/admin/" element={<AdminLayout />}>
          <Route path="dashboard" element={<ProtectedRouteInstitution><AdminDashboard /></ProtectedRouteInstitution>}/>
          <Route path="professors" element={<ProtectedRouteInstitution><ProfessorList /></ProtectedRouteInstitution>}/>
          <Route path="addProfessor" element={<ProtectedRouteInstitution><AddProfessor /></ProtectedRouteInstitution>}/>
          <Route path="students" element={<ProtectedRouteInstitution><StudentList /></ProtectedRouteInstitution>}/>
          <Route path="addStudent" element={<ProtectedRouteInstitution><AddStudent /></ProtectedRouteInstitution>} />
        </Route>

        <Route path="payment-summary" element={<ProtectedRouteInstitution><PaymentSummary /></ProtectedRouteInstitution>} />
        <Route path="payment-success" element={<ProtectedRouteInstitution><PaymentSuccess /></ProtectedRouteInstitution>} />


        {/* Student Routes */}
        <Route path="/student/" element={<StudentLayout />}>
          <Route path="dashboard" element={<ProtectedRouteStudents><StudentDashboard /></ProtectedRouteStudents>} />
          <Route path="course-list" element={<ProtectedRouteStudents><StudentCourseListPage /></ProtectedRouteStudents>} />
          <Route path="challenges" element={<ProtectedRouteStudents><StudentChallengesView /></ProtectedRouteStudents>} />
          <Route path="challenges/:id" element={<ProtectedRouteStudents><StudentPracticePage /></ProtectedRouteStudents>} />
          <Route path="lesson-list/:courseId" element={<ProtectedRouteStudents><StudentLessonListPage /></ProtectedRouteStudents>} />
          <Route path="module/:lessonId" element={<StudentModulePage />} />
          <Route path="activity" element={<StudentActivityPage />} />
          <Route path="task-list" element={<StudentTaskPage />} />
          <Route path="schedules" element={<StudentCalendarPage />} />
        </Route>

        {/* Additional Routes */}
        <Route path="/code-editor" element={<CodeEditor />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;