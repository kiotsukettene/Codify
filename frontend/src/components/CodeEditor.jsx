import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "@/constants";
import Output from "./Output";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Play } from "lucide-react";
import Input from "./Input";
import { executeCode } from "@/api";
import Logo from "@/assets/picture/logos/Logo.png";
import { useStudentStore } from "@/store/studentStore";
import { useprofAuthStore } from "@/store/profAuthStore";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [maximizedPanel, setMaximizedPanel] = useState(null);
  const [output, setOutput] = useState(null);
  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated: isStudentAuthenticated } = useStudentStore();
  const { isAuthenticated: isProfessorAuthenticated } = useprofAuthStore();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const toggleMaximize = (panel) => {
    setMaximizedPanel(maximizedPanel === panel ? null : panel);
  };

  const getPanelStyles = (panel) => {
    if (maximizedPanel === null) {
      return "w-full md:w-1/2 h-[50vh] md:h-full"; // Stack vertically on mobile, side-by-side on medium+
    }
    return maximizedPanel === panel ? "w-full h-full" : "w-0 h-0 hidden";
  };

  const handleInputChange = (newInput) => {
    setInputValue(newInput);
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      const { run: result } = await executeCode(language, sourceCode, inputValue);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput([error.message || "Execution failed"]);
      setIsError(true);
    }
  };

  const handleLogoClick = () => {
    if (isStudentAuthenticated) {
      navigate("/student/dashboard");
    } else if (isProfessorAuthenticated) {
      navigate("/professor/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] overflow-hidden">
      <div className="flex lg:flex-row flex-col items-start justify-between p-2 bg-[#2d2d2d] border-b border-gray-800">
        <div className="lg:mb-2 mb-4">
          <img
            src={Logo}
            className="w-24 h-auto cursor-pointer"
            alt="Logo"
            onClick={handleLogoClick}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSelector language={language} onSelect={handleSelect} />
          <Button className="bg-primary text-white gap-2 text-sm sm:text-base" onClick={runCode}>
            <Play size={14} />
            Run Code
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className={`${getPanelStyles("editor")} transition-all duration-300 border-b md:border-r md:border-b-0 border-gray-800`}>
          <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-gray-800">
            <span className="text-gray-300 text-sm">main</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMaximize("editor")}
              className="text-gray-400"
            >
              {maximizedPanel === "editor" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
          </div>
          <Editor
            height="calc(100% - 40px)" // Adjust height to fit panel
            theme="vs-dark"
            language={language}
            onMount={onMount}
            defaultValue={CODE_SNIPPETS[language]}
            value={value}
            onChange={(value) => setValue(value)}
            options={{
              fontSize: 12, // Smaller font for mobile
              lineNumbers: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: true,
              automaticLayout: true,
              fontFamily: "monospace",
              renderLineHighlight: "all",
              lineHeight: 18, // Tighter line height for mobile
            }}
          />
        </div>
        <div className={`${getPanelStyles("input")} transition-all duration-300`}>
          <Input
            isMaximized={maximizedPanel === "input"}
            onToggleMaximize={() => toggleMaximize("input")}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <Output editorRef={editorRef} language={language} output={output} isError={isError} />
    </div>
  );
};

export default CodeEditor;