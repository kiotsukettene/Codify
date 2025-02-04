
import './App.css'
import StudentDashboard from './pages/student-view-pages/Dashboard'
import CodeEditor from './components/CodeEditor'
import { Routes, Route} from 'react-router-dom'
import PaymentSuccess from './components/admin-view/payment-success'
import PaymentSummary from './components/admin-view/payment-summary'
import AdminLogin from './pages/Auth-pages/Admin-Login'
import AdminEmailVerificationPage from './pages/Auth-pages/Admin-Email-Verification-Page'
import AdminRegisterPage from './pages/Auth-pages/Admin-Register'
import AdminForgotPasswordPage from './pages/Auth-pages/Admin-Forgot-Password'
import AdminNewPasswordPage from './pages/Auth-pages/Admin-New-Password'
import AdminSuccessResetPage from './pages/Auth-pages/Admin-Success-Reset'


function App() {
 
  return (
    
  
    // <BrowserRouter>
    <Routes>
      <Route path="/student/dashboard" element={<StudentDashboard/>}/>
      <Route path="/code-editor" element={<CodeEditor/>}/>
      <Route path='/admin-register' element={<AdminRegisterPage/>}/>
      <Route path='/payment-summary' element={<PaymentSummary/>}/>
      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/admin-login' element={<AdminLogin/>}/>
      <Route path='/email-verify' element={<AdminEmailVerificationPage/>}/>
      <Route path='/admin-forgot-password' element={<AdminForgotPasswordPage/>}/>
      <Route path='/admin-setNewPassword' element={<AdminNewPasswordPage/>}/>
      <Route path='/admin-success-reset' element={<AdminSuccessResetPage/>}/>
    </Routes>
    // </BrowserRouter>
    
    
  )
}

export default App
