
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "@/constants";
import Output from "./Output";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Play } from "lucide-react";
import Input from "./Input";
import { executeCode } from "@/api";
import Logo from '@/assets/picture/logos/Logo.png';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [maximizedPanel, setMaximizedPanel] = useState(null);
  const [output, setOutput] = useState(null);
  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for input

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

  const getPanelWidth = (panel) => {
    if (maximizedPanel === null) return "w-1/2";
    return maximizedPanel === panel ? "w-full" : "w-0 hidden";
  };

  const handleInputChange = (newInput) => {
    setInputValue(newInput); // Update input state
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      const { run: result } = await executeCode(language, sourceCode, inputValue); // Pass inputValue
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput([error.message || "Execution failed"]);
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-[#2d2d2d] border-b border-gray-800">
        <div>
          <img src={Logo} className="w-28 h-auto" alt="Logo" />
        </div>
        <div className="flex items-center pt-4 gap-4">
          <LanguageSelector language={language} onSelect={handleSelect} />
          <Button className="bg-primary text-white gap-2" onClick={runCode}>
            <Play size={16} />
            Run Code
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`${getPanelWidth("editor")} transition-all duration-300 border-r border-gray-800`}>
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
            height="calc(100vh - 120px)"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            defaultValue={CODE_SNIPPETS[language]}
            value={value}
            onChange={(value) => setValue(value)}
            options={{
              fontSize: 14,
              lineNumbers: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: true,
              automaticLayout: true,
              fontFamily: "monospace",
              renderLineHighlight: "all",
              lineHeight: 21,
            }}
          />
        </div>
        <div className={`${getPanelWidth("input")} transition-all duration-300`}>
          <Input
            isMaximized={maximizedPanel === "input"}
            onToggleMaximize={() => toggleMaximize("input")}
            onInputChange={handleInputChange} // Pass callback to update input
          />
        </div>
      </div>
      <Output editorRef={editorRef} language={language} output={output} isError={isError} />
    </div>
  );
};

export default CodeEditor;