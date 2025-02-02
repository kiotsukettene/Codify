
import './App.css'
import StudentDashboard from './pages/student-view-pages/Dashboard'
import CodeEditor from './components/CodeEditor'
import { Routes, Route} from 'react-router-dom'
import AdminRegister from './pages/Auth-pages/Admin-Register'
import AdminLogin from './pages/admin-view-pages/Login'
import PaymentSuccess from './components/admin-view/payment-success'
import PaymentSummary from './components/admin-view/payment-summary'
import AdminEmailVerificationPage from './pages/admin-view-pages/Email-Verification-Page'


function App() {
 
  return (
    
  
    // <BrowserRouter>
    <Routes>
      <Route path="/student/dashboard" element={<StudentDashboard/>}/>
      <Route path="/code-editor" element={<CodeEditor/>}/>
      <Route path='/admin-register' element={<AdminRegister/>}/>
      <Route path='/payment-summary' element={<PaymentSummary/>}/>
      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/login' element={<AdminLogin/>}/>
      <Route path='/email-verify' element={<AdminEmailVerificationPage/>}/>
    </Routes>
    // </BrowserRouter>
    
    
  )
}

export default App
