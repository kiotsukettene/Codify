
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
import ProfessorLogin from './pages/Auth-pages/Professor-Login'
import ProfForgotPassword from './pages/Auth-pages/Professor-Forgot-Password'
import ProfNewPassword from './pages/Auth-pages/Professor-New-Password'
import ProfSuccessPassword from './pages/Auth-pages/Professor-Success-Password'
// redirect authenticated and paid institution to dashboard page 

const RedirectAuthenticatedInstitution = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();
  

  if (isAuthenticated && institution.isVerified) {
    return <Navigate to="/admin/payment-summary" replace/>;
  } 

  return children;
}

// protect routes that require authentication

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, institution } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }


  // If already verified, prevent access to /email-verify
  if (institution.isVerified && window.location.pathname === "/admin/email-verify") {
    return <Navigate to="/admin/payment-summary" replace />;
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
      <Route path="/professor/login" element={<ProfessorLogin/>}/>
      <Route path="/professor/forgot-password" element={<ProfForgotPassword/>}/>
      <Route path="/professor/reset-password/:token" element={<ProfNewPassword/>}/>
      <Route path="/professor/success-reset" element={<ProfSuccessPassword/>}/>


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
            <ProtectedRoute>
            <PaymentSummary />
            </ProtectedRoute>
          } />
      <Route path='/admin/payment-success' element={<PaymentSuccess/>}/>
        <Route path='/admin/login' element={
          <RedirectAuthenticatedInstitution>
            <AdminLogin />
          </RedirectAuthenticatedInstitution>
      
        }
        />
        <Route path='/admin/email-verify' element={
          <ProtectedRoute>
            <AdminEmailVerificationPage />
          </ProtectedRoute>
          
        } />
        <Route path='/admin/forgot-password' element={<RedirectAuthenticatedInstitution>
          <AdminForgotPasswordPage/>
        </RedirectAuthenticatedInstitution>} />
      <Route path='/admin/reset-password/:token' element={<RedirectAuthenticatedInstitution><AdminNewPasswordPage/></RedirectAuthenticatedInstitution>}/>
      <Route path='/admin/success-reset' element={<AdminSuccessResetPage/>}/>
    </Routes>
    <Toaster/>

  </div>
  
    
    
  )
}

export default App;
