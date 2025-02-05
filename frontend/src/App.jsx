import "./App.css";
import StudentDashboard from "./pages/student-view-pages/Dashboard";
import CodeEditor from "./components/CodeEditor";
import { Routes, Route } from "react-router-dom";
import PaymentSuccess from "./components/admin-view/payment-success";
import PaymentSummary from "./components/admin-view/payment-summary";
import AdminLogin from "./pages/Auth-pages/Admin-Login";
import AdminEmailVerificationPage from "./pages/Auth-pages/Admin-Email-Verification-Page";
import AdminRegisterPage from "./pages/Auth-pages/Admin-Register";
import AdminForgotPasswordPage from "./pages/Auth-pages/Admin-Forgot-Password";
import AdminNewPasswordPage from "./pages/Auth-pages/Admin-New-Password";
import AdminSuccessResetPage from "./pages/Auth-pages/Admin-Success-Reset";
import AdminDashboard from "./pages/admin-view-pages/Dashboard";
import ProfessorList from "./pages/admin-view-pages/Professor";
import AdminLayout from "./Layout/AdminLayout";
import AddProfessor from "./pages/admin-view-pages/Add-Professor";
import AddStudent from "./pages/admin-view-pages/Add-Student";
import StudentList from "./pages/admin-view-pages/Student";

function App() {
  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/code-editor" element={<CodeEditor />} />
      <Route path="/admin-register" element={<AdminRegisterPage />} />
      <Route path="/payment-summary" element={<PaymentSummary />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      
      <Route path="/email-verify" element={<AdminEmailVerificationPage />}/>
      <Route path="/admin/forgot-password"element={<AdminForgotPasswordPage />}/>
      <Route path="/admin/set-new-password" element={<AdminNewPasswordPage />} />
      <Route path="/admin/success-reset" element={<AdminSuccessResetPage />} />
      <Route path="/admin/admin-login" element={<AdminLogin />} />




      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="professors" element={<ProfessorList />} />
        <Route path="addProfessor" element={<AddProfessor/>}/>
      <Route path="students" element={<StudentList/>}/>
      <Route path="addStudent" element={<AddStudent/>}/>
      </Route>
    </Routes>
    // </BrowserRouter>
  );
}

export default App;
