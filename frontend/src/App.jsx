import "./App.css";
import StudentDashboard from "./pages/student-view-pages/Dashboard";
import CodeEditor from "./components/CodeEditor";
import { Routes, Route, Navigate } from "react-router-dom";
import PaymentSuccess from "./components/admin-view/payment-success";
import PaymentSummary from "./components/admin-view/payment-summary";
import AdminLogin from "./pages/admin-view-pages/admin-auth/Admin-Login";
import AdminEmailVerificationPage from "./pages/admin-view-pages/admin-auth/Admin-Email-Verification-Page";
import AdminRegisterPage from "./pages/admin-view-pages/admin-auth/Admin-Register";
import AdminForgotPasswordPage from "./pages/admin-view-pages/admin-auth/Admin-Forgot-Password";
import AdminNewPasswordPage from "./pages/admin-view-pages/admin-auth/Admin-New-Password";
import AdminSuccessResetPage from "./pages/admin-view-pages/admin-auth/Admin-Success-Reset";
import AdminDashboard from "./pages/admin-view-pages/Dashboard";
import ProfessorList from "./pages/admin-view-pages/admin-professor/Professor";
import AdminLayout from "./Layout/AdminLayout";
import AddProfessor from "./pages/admin-view-pages/admin-professor/Add-Professor";
import AddStudent from "./pages/admin-view-pages/admin-student/Add-Student";
import StudentList from "./pages/admin-view-pages/admin-student/Student";import { Toaster } from 'react-hot-toast'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from './components/LoadingSpinner'
import ProfessorLogin from './pages/professor-view-pages/professor-auth/Professor-Login'
import ProfForgotPassword from './pages/professor-view-pages/professor-auth/Professor-Forgot-Password'
import ProfNewPassword from './pages/professor-view-pages/professor-auth/Professor-New-Password'
import ProfessorVerify from "./pages/professor-view-pages/professor-auth/Professor-Verify-Email"; 
import Courses from "./pages/professor-view-pages/Course";

import ProfSuccessPassword from './pages/professor-view-pages/professor-auth/Professor-Success-Password'
import GuestLayout from "./Layout/GuestLayout";
import { useStudentStore } from "./store/studentStore";
import StudentLoginPage from "./pages/student-view-pages/auth/Student-Login";
import StudentLayout from "./Layout/StudentLayout";
import StudentCourseListPage from "./pages/student-view-pages/course-management/student-course-list";
import PageNotFoundPage from "./pages/Guest-view-pages/NotFound";
import MainLogin from "./pages/Guest-view-pages/Login";
import LandingPage from "./pages/Guest-view-pages/Landing-page";
import StudentForgotPasswordPage from "./pages/student-view-pages/auth/Student-Forgot-Password";
import StudentNewPasswordPage from "./pages/student-view-pages/auth/Student-New-Password";
// redirect authenticated and paid institution to dashboard page 

const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  

  if (isAuthenticated && institution.isVerified && institution.isPaid) {
    return <Navigate to="/admin/dashboard" replace/>;
  }

  if (isAuthenticated && institution.isVerified && !institution.isPaid) {
    return <Navigate to="/admin/payment-summary" replace/>;
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


function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
 
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 
  if (isCheckingAuth) return <LoadingSpinner/>
  return (
  <div>
    
      <Routes>
      <Route path="/code-editor" element={<CodeEditor/>}/>
      <Route path="/professor/login" element={<ProfessorLogin/>}/>
      <Route path="/professor/forgot-password" element={<ProfForgotPassword/>}/>
      <Route path="/professor/reset-password/:token" element={<ProfNewPassword/>}/>
      <Route path="/professor/courses" element={<Courses/>}/>
      <Route path="/professor/verify-email" element={<ProfessorVerify/>}/>

    


        <Route
          path='/admin/register'
          element={
            <RedirectAuthenticatedInstitution>
              <AdminRegisterPage />
            </RedirectAuthenticatedInstitution>
          } />
          

          
          <Route
          path='/admin/payment-summary'
          element={
            <ProtectedRouteInstitution>
            <PaymentSummary />
            </ProtectedRouteInstitution>
          } />

             <Route path="*" element={<PageNotFoundPage />} />
        <Route path="/login" element={<MainLogin />} />
         <Route index element={<LandingPage/>}/>
        </Route>

                  <Route path='/admin/email-verify' element={
          <ProtectedRouteInstitution>
            <AdminEmailVerificationPage />
          </ProtectedRouteInstitution>
          
          } />
        
        
      <Route path='/admin/payment-success' element={
        <ProtectedRouteInstitution>
          <PaymentSuccess />
        </ProtectedRouteInstitution>
        } />


          <Route path='/admin/login' element={
          <RedirectAuthenticatedInstitution>
            <AdminLogin />
          </RedirectAuthenticatedInstitution>
        }
          />

        <Route path='/admin/forgot-password' element={<RedirectAuthenticatedInstitution>
          <AdminForgotPasswordPage/>
        </RedirectAuthenticatedInstitution>} />
      <Route path='/admin/reset-password/:token' element={<RedirectAuthenticatedInstitution><AdminNewPasswordPage/></RedirectAuthenticatedInstitution>}/>
        <Route path='/admin/success-reset' element={<AdminSuccessResetPage />} />
        
      <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <ProtectedRouteInstitution><AdminDashboard /></ProtectedRouteInstitution>
          }
          />
        <Route path="professors" element={<ProtectedRouteInstitution>
              <ProfessorList />
            </ProtectedRouteInstitution>} />
        <Route path="addProfessor" element={<ProtectedRouteInstitution>
              <AddProfessor/>
            </ProtectedRouteInstitution>}/>
      <Route path="students" element={<ProtectedRouteInstitution>
              <StudentList/>
            </ProtectedRouteInstitution>}/>
      <Route path="addStudent" element={<ProtectedRouteInstitution>
              <AddStudent/>
            </ProtectedRouteInstitution>}/>
        </Route>
        


    </Routes>
    <Toaster position="top-right"/>

  </div>
  
    
    
  )
}

export default App;