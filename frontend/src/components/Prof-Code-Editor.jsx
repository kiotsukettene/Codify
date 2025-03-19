import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";


const ProfCodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };


  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] overflow-hidden w-full">
     
      <div className="flex-1 w-full ">
        <div className="w-full transition-all duration-300">
              </div>
          <Editor
            theme="vs-dark"
            language={language}
            onMount={onMount}
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
              readOnly: true, 
              domReadOnly: true, 
            }}
          />
      </div>
    </div>
  );
};

export default ProfCodeEditor;