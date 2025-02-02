
import './App.css'
import StudentDashboard from './pages/student-view-pages/Dashboard'
import CodeEditor from './components/CodeEditor'
import ProfessorCourse from './pages/professor-view-pages/Course'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/code-editor" element={<CodeEditor />} />
      <Route path="/professor-course" element={<ProfessorCourse />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
