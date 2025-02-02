import "./App.css";
import StudentDashboard from "./pages/student-view-pages/Dashboard";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <div className="container mx-auto p-4">
      <CodeEditor />
      <StudentDashboard />
    </div>
  );
}

export default App;
