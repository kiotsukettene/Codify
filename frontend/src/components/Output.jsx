import { executeCode } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Maximize2, Minimize2, Play, Trash2 } from "lucide-react"
import { useState } from "react"

const Output = ({ editorRef, language, output, isError }) => {

  const [isMaximized, setIsMaximized] = useState(false)

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  
  return (
    <div
    className={`bg-[#1e1e1e] border-t border-gray-800 transition-all duration-300 ${
      isMaximized ? "h-full" : "h-[200px]"
    }`}
  >
    <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-gray-800">
      <span className="text-gray-300 text-sm">Output</span>
      <Button variant="ghost" size="sm" onClick={toggleMaximize} className="text-gray-400 ">
        {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </Button>
    </div>
    <ScrollArea className={`w-full ${isMaximized ? "h-[calc(100vh-160px)]" : "h-[160px]"}`}>
      <pre className={`font-mono text-sm p-4 ${isError ? "text-red-400" : "text-green-400"}`}>
        {output ? output.map((line, index) => <div key={index}>{line}</div>) : "Output will be displayed here"}
      </pre>
    </ScrollArea>
  </div>
  )
}

export default Output