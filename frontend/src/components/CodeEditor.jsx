import { Editor } from "@monaco-editor/react"
import { useRef, useState } from "react"
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "@/constants";
import Output from "./Output";


const CodeEditor = () => {

    const editorRef = useRef();
    const [ value, setValue] = useState('');
    const [language, setLanguage] = useState('javascript');
    
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }

    const handleSelect = (language) => {
        setLanguage(language);
        setValue(
            CODE_SNIPPETS[language]
        );
    }
    
  return (
    <div className = "p-4 bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            <div className="w-1/2">
            <LanguageSelector language={language} onSelect={handleSelect} />
            <Editor 
            height ="75vh"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            defaultValue={CODE_SNIPPETS[language]}
            value={ value }
            onChange={
            (value) => setValue(value)
            }
            />
            </div>
            <Output editorRef={editorRef} language={language}/>
        </div>
    </div>
  )
}

export default CodeEditor
