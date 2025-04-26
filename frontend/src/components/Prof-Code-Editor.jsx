import { Editor } from "@monaco-editor/react";
import { useRef, useEffect } from "react";

const ProfCodeEditor = ({ code = "", language = "javascript", onChange }) => {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
  };

  // Update editor content when code prop changes
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] overflow-hidden w-full">
     
      <div className="flex-1 w-full ">
        <div className="w-full transition-all duration-300">
              </div>
          <Editor
            theme="vs-dark"
            language={language}
            onMount={onMount}
            value={code}
            onChange={onChange}
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