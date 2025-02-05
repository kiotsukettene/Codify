
import './App.css'
import StudentDashboard from './pages/student-view-pages/Dashboard'
import CodeEditor from './components/CodeEditor'
import { Routes, Route, Navigate} from 'react-router-dom'
import PaymentSuccess from './components/admin-view/payment-success'
import PaymentSummary from './components/admin-view/payment-summary'
import AdminLogin from './pages/Auth-pages/Admin-Login'
import AdminEmailVerificationPage from './pages/Auth-pages/Admin-Email-Verification-Page'
import AdminRegisterPage from './pages/Auth-pages/Admin-Register'
import AdminForgotPasswordPage from './pages/Auth-pages/Admin-Forgot-Password'
import AdminNewPasswordPage from './pages/Auth-pages/Admin-New-Password'
import AdminSuccessResetPage from './pages/Auth-pages/Admin-Success-Reset'
import { Toaster } from 'react-hot-toast'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from './components/LoadingSpinner'

// redirect authenticated and paid institution to dashboard page 

const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  

  if (isAuthenticated && institution.isVerified) {
    return <Navigate to="/payment-summary" replace/>;
  } 

  return children;
}

// protect routes that require authentication

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!institution.isVerified) {
    return <Navigate to="/email-verify" replace/>;
  }

  // If already verified, prevent access to /email-verify
  if (institution.isVerified && window.location.pathname === "/email-verify") {
    return <Navigate to="/payment-summary" replace />;
  }

   
  return children;
}


function App() {
  const { isCheckingAuth, checkAuth} = useAuthStore();
 
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 
  if (isCheckingAuth) return <LoadingSpinner/>
  return (
  <div>
    
      <Routes>
      <Route path="/student/dashboard" element={<StudentDashboard/>}/>
      <Route path="/code-editor" element={<CodeEditor/>}/>
        <Route
          path='/admin-register'
          element={
            <RedirectAuthenticatedInstitution>
              <AdminRegister />
            </RedirectAuthenticatedInstitution>
          } />
        <Route
          path='/payment-summary'
          element={
            <ProtectedRoute>
            <PaymentSummary />
            </ProtectedRoute>
          } />
      <Route path='/payment-success' element={<PaymentSuccess/>}/>
        <Route path='/login' element={
          <RedirectAuthenticatedInstitution>
            <AdminLogin />
          </RedirectAuthenticatedInstitution>
      
        }
        />
        <Route path='/email-verify' element={
          <ProtectedRoute>
          <AdminEmailVerificationPage />
        </ProtectedRoute>
         
        } />
      <Route path='/admin-forgot-password' element={<AdminForgotPasswordPage/>}/>
      <Route path='/admin-setNewPassword' element={<AdminNewPasswordPage/>}/>
      <Route path='/admin-success-reset' element={<AdminSuccessResetPage/>}/>
    </Routes>
    <Toaster/>

  </div>
  
    
    
  )
}

export default App
