import { executeCode } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Trash2 } from "lucide-react"
import { useState } from "react"

const Output = ({ editorRef, language }) => {

    const [output, setOutput] = useState(null)
    const [isError, setIsError] = useState(false)
    

    const runCode = async() => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;

        try {
            const {run:result} = await executeCode(language, sourceCode);

            setOutput(result.output.split("\n"))
            result.stderr ? setIsError(true) : setIsError(false) 

        } catch (error) {
            console.log(error);
        } 
    }
  return (
    <Card className="w-1/2 m-4 h-[80vh]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Output</CardTitle>
        <div className="space-x-2">
          <Button 
            variant="default"
            size="sm"
            className="px-4"
            onClick={runCode}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Code
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="px-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent >
        <ScrollArea className="h-[70vh] w-full rounded-md border p-4 bg-slate-950">
          <pre className={`font-mono text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {output ? output.map ((line, index) => (
              <div key={index}>{line}</div>
            ))
            : "Output will be displayed here"}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Output