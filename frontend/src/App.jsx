
import './App.css'
import StudentDashboard from './pages/student-view-pages/Dashboard'
// import CodeEditor from './components/CodeEditor'
import { Routes, Route} from 'react-router-dom'
// import PaymentSuccess from './components/admin-view/payment-success'
// import PaymentSummary from './components/admin-view/payment-summary'
// import AdminLogin from './pages/Auth-pages/Admin-Login'
// import AdminEmailVerificationPage from './pages/Auth-pages/Admin-Email-Verification-Page'
// import AdminRegisterPage from './pages/Auth-pages/Admin-Register'
// import AdminForgotPasswordPage from './pages/Auth-pages/Admin-Forgot-Password'
// import AdminNewPasswordPage from './pages/Auth-pages/Admin-New-Password'
// import AdminSuccessResetPage from './pages/Auth-pages/Admin-Success-Reset'
// import { Toaster } from 'react-hot-toast'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from './components/LoadingSpinner'
// import StudentLogin from './pages/Auth-pages/Student-Login'
import { useStudentAuthStore } from './store/studentAuthStore'
import LandingPage from './pages/Guest-view-pages/Landing-page'
import MainLogin from './pages/Guest-view-pages/Login'
import GuestLayout from './Layout/GuestLayout'
import StudentLayout from './Layout/StudentLayout'

// redirect authenticated and paid institution to dashboard page 

// const RedirectAuthenticatedInstitution = ({ children }) => {
//   const { isAuthenticated, institution } = useAuthStore();
  

//   if (isAuthenticated && institution.isVerified) {
//     return <Navigate to="/admin/payment-summary" replace/>;
//   } 

//   return children;
// }

// protect routes that require authentication

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, institution } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/admin/login" replace />;
//   }


//   // If already verified, prevent access to /email-verify
//   if (institution.isVerified && window.location.pathname === "/admin/email-verify") {
//     return <Navigate to="/admin/payment-summary" replace />;
//   }
//   return children;
// }


// redirect authenticated for student to dashboard page 

// const RedirectAuthenticatedStudent = ({ children }) => {
//   const { isAuthenticated } = useStudentAuthStore();

//   if (isAuthenticated) {
//     return <Navigate to="/student/dashboard" replace />;
//   }

//   return children;
// };


// protect routes FOR STUDENT
// const ProtectedStudentRoute = ({ children }) => {
//   const { isAuthenticated, isCheckingAuthStudent } = useStudentAuthStore();

//   if (isCheckingAuthStudent) return <LoadingSpinner />;

//   if (!isAuthenticated) {
//     return <Navigate to="/student/login" replace />;
//   }

//   return children;
// };


function App() {
  const { isCheckingAuth, checkAuth} = useAuthStore();

  const { checkAuthStudent, student, isAuthenticated} = useStudentAuthStore();

  useEffect(() => {
    checkAuthStudent();
  }, [checkAuthStudent]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 
  if (isCheckingAuth) return <LoadingSpinner/>

  return (
  // <div>
    
  //     <Routes>
  //      {/* Protected Student Routes */}
  // <Route path="/student/dashboard" element={
  //   <ProtectedStudentRoute>
  //     <StudentDashboard />
  //   </ProtectedStudentRoute>
  // }/>

  //     <Route path="/code-editor" element={<CodeEditor/>}/>
  //     <Route path="/home" element={<LandingPage/>}/>
  //     <Route path="/login" element={<MainLogin/>}/>

  //  {/* Redirect already logged-in students from login/signup */}
  // <Route path='/student/login' element={
  //   <RedirectAuthenticatedStudent>
  //     <StudentLogin />
  //   </RedirectAuthenticatedStudent>
  // }/>

  //       <Route
  //         path='/admin/register'
  //         element={
  //           <RedirectAuthenticatedInstitution>
  //             <AdminRegisterPage />
  //           </RedirectAuthenticatedInstitution>
  //         } />
  //       <Route
  //         path='/admin/payment-summary'
  //         element={
  //           <ProtectedRoute>
  //           <PaymentSummary />
  //           </ProtectedRoute>
  //         } />
  //     <Route path='/admin/payment-success' element={<PaymentSuccess/>}/>
  //       <Route path='/admin/login' element={
  //         <RedirectAuthenticatedInstitution>
  //           <AdminLogin />
  //         </RedirectAuthenticatedInstitution>
      
  //       }
  //       />
  //       <Route path='/admin/email-verify' element={
  //         <ProtectedRoute>
  //           <AdminEmailVerificationPage />
  //         </ProtectedRoute>
          
  //       } />


  //       <Route path='/admin/forgot-password' element={<RedirectAuthenticatedInstitution>
  //         <AdminForgotPasswordPage/>
  //       </RedirectAuthenticatedInstitution>} />
  //     <Route path='/admin/reset-password/:token' element={<RedirectAuthenticatedInstitution><AdminNewPasswordPage/></RedirectAuthenticatedInstitution>}/>
  //     <Route path='/admin/success-reset' element={<AdminSuccessResetPage/>}/>
  //   </Routes>
  //   <Toaster/>

  // </div>

  <Routes>
    <Route path='/' element={<GuestLayout/>}>
      <Route path='/home' element={<LandingPage/>}/>
      <Route path='/login' element={<MainLogin/>}/>
    </Route>

    <Route path='/student' element={<StudentLayout/>}>
       <Route path='dashboard' element={<StudentDashboard/>}/>
    </Route>
  </Routes>
  
    
    
  )
}

export default App;
