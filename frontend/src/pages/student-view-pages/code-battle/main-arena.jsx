
import { useState, useEffect, useRef } from "react"
import { Editor } from "@monaco-editor/react"
import {Clock,Play,Send,XCircle,CheckCircle,AlertCircle,ChevronRight,ChevronDown,Trophy,User,Users,ArrowLeft,Expand,Minimize,} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router-dom"

//============= Sample problem data=================
const problemData = {
  title: "Data Sorting Challenge",
  points: 150,
  timeLimit: 1800, // 30 minutes in seconds
  description: `
## Problem Description

You are given an array of integers. Your task is to sort the array in ascending order using any algorithm of your choice.

### Input Format
- The first line contains an integer N, the number of elements in the array.
- The second line contains N space-separated integers representing the elements of the array.

### Output Format
- A single line containing N space-separated integers representing the sorted array.

### Constraints
- 1 ≤ N ≤ 10^5
- -10^9 ≤ array[i] ≤ 10^9
  `,
  examples: [
    {
      input: "5\n5 2 9 1 5",
      output: "1 2 5 5 9",
      explanation: "The sorted array in ascending order.",
    },
    {
      input: "3\n3 1 2",
      output: "1 2 3",
      explanation: "The sorted array in ascending order.",
    },
  ],
  hints: [
    "Consider using built-in sorting functions for simplicity.",
    "If implementing your own sort, quicksort or mergesort would be efficient for large arrays.",
  ],
  boilerplate: {
    javascript: `function sortArray(arr) {
  // Your code here
  
  return arr;
}

// Example usage:
// const sorted = sortArray([5, 2, 9, 1, 5]);
// console.log(sorted); // Should output [1, 2, 5, 5, 9]`,
    python: `def sort_array(arr):
    # Your code here
    
    return arr

# Example usage:
# sorted_arr = sort_array([5, 2, 9, 1, 5])
# print(sorted_arr) # Should output [1, 2, 5, 5, 9]`,
    java: `import java.util.*;

public class Solution {
    public static int[] sortArray(int[] arr) {
        // Your code here
        
        return arr;
    }
    
    public static void main(String[] args) {
        // Example usage:
        // int[] arr = {5, 2, 9, 1, 5};
        // int[] sorted = sortArray(arr);
        // System.out.println(Arrays.toString(sorted)); // Should output [1, 2, 5, 5, 9]
    }
}`,
  },
}

// =============Sample test cases===============
const testCases = [
  { id: 1, input: "[5, 2, 9, 1, 5]", expectedOutput: "[1, 2, 5, 5, 9]", status: "waiting" },
  { id: 2, input: "[3, 1, 2]", expectedOutput: "[1, 2, 3]", status: "waiting" },
  { id: 3, input: "[10, -5, 0, 100, 20]", expectedOutput: "[-5, 0, 10, 20, 100]", status: "waiting" },
  { id: 4, input: "[7, 7, 7, 7]", expectedOutput: "[7, 7, 7, 7]", status: "waiting" },
]

//============== Sample opponent data===============
const opponents = [
  { id: 1, name: "CodeNinja", avatar: "/placeholder.svg?height=40&width=40", progress: 75, score: 120 },
]

export default function MainArena() {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(problemData.boilerplate.javascript)
  const [output, setOutput] = useState("")
  const [testResults, setTestResults] = useState(testCases)
  const [timeLeft, setTimeLeft] = useState(problemData.timeLimit)
  const [isRunning, setIsRunning] = useState(false)
  const [userProgress, setUserProgress] = useState(0)
  const [theme, setTheme] = useState("vs-dark")
  const [isEditorExpanded, setIsEditorExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("output")
  const [editorKey, setEditorKey] = useState(0) // Key to force editor remount
  const navigate = useNavigate()

  // Refs for scrollable elements
  const testCasesRef = useRef(null)
  const outputRef = useRef(null)
  const editorRef = useRef(null)

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle editor 
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  // ========================== Language change =========================
  useEffect(() => {
    if (language === "javascript") {
      setCode(problemData.boilerplate.javascript)
    } else if (language === "python") {
      setCode(problemData.boilerplate.python)
    } else if (language === "java") {
      setCode(problemData.boilerplate.java)
    }
  }, [language])

  // ========================== Countdown Timer==========================
  useEffect(() => {
    let timer
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timeLeft])

  // Handle editor expansion
  useEffect(() => {
    // Force editor to remount after layout changes
    const timer = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isEditorExpanded])

  // Toggle editor expansion
  const toggleEditorExpansion = () => {
  
    setEditorKey((prev) => prev + 1)

    // Use setTimeout to avoid immediate state changes that could cause layout thrashing
    setTimeout(() => {
      setIsEditorExpanded((prev) => !prev)
    }, 10)
  }

  // ========================== running code==========================
  const handleRunCode = () => {
    setIsRunning(true)
    setOutput("Running your code...")
    setActiveTab("output") // Switch to output tab

    // processing delay
    setTimeout(() => {
      setOutput(
        "Code executed successfully!\n\nTest case #1: [5, 2, 9, 1, 5] → [1, 2, 5, 5, 9] ✓\n\nYour function correctly sorts the array.",
      )
      setIsRunning(false)

      // Update progress
      setUserProgress((prev) => Math.min(prev + 25, 100))
    }, 1500)
  }

  // ========================== submitting code function==========================
  const handleSubmitCode = () => {
    setIsRunning(true)
    setOutput("Evaluating your solution against all test cases...")

    // processing delay
    setTimeout(() => {
      // Update test results
      const updatedResults = testResults.map((test) => ({
        ...test,
        status: Math.random() > 0.3 ? "passed" : "failed", // Randomly pass/fail for demo
      }))

      setTestResults(updatedResults)

      const passedCount = updatedResults.filter((t) => t.status === "passed").length
      const totalCount = updatedResults.length

      setOutput(`Submission results: ${passedCount}/${totalCount} test cases passed.`)
      setIsRunning(false)

      // Update progress based on passed tests
      setUserProgress(Math.round((passedCount / totalCount) * 100))
      setActiveTab("testcases") // Switch to test cases tab after submission
    }, 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden">
      {/* Header with battle info */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#18122B] border-b border-[#2B1F4A]">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/arena-dashboard')} variant="ghost" className="p-2 hover:bg-[#2B1F4A] rounded-full text-[#C2C2DD] hover:text-[#F5F5F5]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              {problemData.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#C2C2DD]">
             
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-yellow-400" />
                {problemData.points} points
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#2B1F4A] px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 text-[#E94560]" />
            <span className={`font-mono ${timeLeft < 300 ? "text-[#E94560]" : "text-[#C2C2DD]"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="border-[#2B1F4A] hover:bg-[#2B1F4A] bg-neutral-700 hover:text-[#F5F5F5]"
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span>{opponents.length + 1} Players</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You and {opponents.length} others are in this battle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Problem statement (hidden when editor is expanded) */}
        {!isEditorExpanded && (
          <div className="w-2/5 border-r border-[#2B1F4A] overflow-y-auto p-6 bg-[#18122B]">
            <Tabs defaultValue="description">
              <TabsList className="bg-[#0D0A1A] mb-4">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="examples"
                  className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
                >
                  Examples
                </TabsTrigger>
                <TabsTrigger
                  value="hints"
                  className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
                >
                  Hints
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{problemData.description}</ReactMarkdown>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="mt-0 space-y-4">
                {problemData.examples.map((example, index) => (
                  <div key={index} className="bg-[#0D0A1A] rounded-lg p-4 border border-[#2B1F4A]">
                    <h3 className="font-semibold text-[#B689F4] mb-2">Example {index + 1}</h3>

                    <div className="mb-3">
                      <div className="text-sm text-[#C2C2DD] mb-1">Input:</div>
                      <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-sm">{example.input}</pre>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-[#C2C2DD] mb-1">Output:</div>
                      <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-sm">{example.output}</pre>
                    </div>

                    {example.explanation && (
                      <div>
                        <div className="text-sm text-[#C2C2DD] mb-1">Explanation:</div>
                        <p className="text-sm">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="hints" className="mt-0">
                <div className="bg-[#0D0A1A] rounded-lg p-4 border border-[#2B1F4A]">
                  <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Hints
                  </h3>
                  <ul className="space-y-2">
                    {problemData.hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Right panel - Code editor */}
        <div className={`flex-1 flex flex-col bg-[#0D0A1A] ${isEditorExpanded ? "w-full" : ""}`}>
          {/* Language selector */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#18122B] border-b border-[#2B1F4A]">
            <div className="flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0D0A1A] text-[#F5F5F5] border border-[#2B1F4A] rounded px-2 py-1 text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className=" border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
              >
                Toggle Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-white border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={toggleEditorExpansion}
              >
                {isEditorExpanded ? <Minimize/> : <Expand/>}
              </Button>
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <Editor
                key={editorKey}
                height="100%"
                language={language === "javascript" ? "javascript" : language === "python" ? "python" : "java"}
                value={code}
                onChange={setCode}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {/* Output panel */}
          <div className="h-1/3 border-t border-[#2B1F4A] flex flex-col">
            <Tabs defaultValue="output" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between px-4 py-2 bg-[#18122B]">
                <TabsList className="bg-[#0D0A1A]">
                  <TabsTrigger
                    value="output"
                    className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
                  >
                    Output
                  </TabsTrigger>
                  <TabsTrigger
                    value="testcases"
                    className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
                  >
                    Test Cases
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  <Button
                    onClick={handleSubmitCode}
                    disabled={isRunning}
                    className="bg-[#E94560] hover:bg-[#E94560]/80 text-white"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit
                  </Button>
                </div>
              </div>

              <TabsContent value="output" className="flex-1 p-0 m-0 h-full">
                <div className="h-full">
                  <pre
                    ref={outputRef}
                    className="bg-[#1E1B38] text-[#C2C2DD] p-4 h-full overflow-auto font-mono text-sm"
                  >
                    {output || "Run your code to see output here..."}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="testcases" className="flex-1 p-0 m-0 h-full">
                <div className="h-full">
                  <div ref={testCasesRef} className="bg-[#1E1B38] h-full overflow-auto p-4">
                    {testResults.map((test) => (
                      <div key={test.id} className="border border-[#2B1F4A] rounded-lg overflow-hidden mb-3">
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-[#18122B] transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">Test Case #{test.id}</span>
                              {test.status === "passed" && <CheckCircle className="h-4 w-4 text-[#14AE5C]" />}
                              {test.status === "failed" && <XCircle className="h-4 w-4 text-[#E94560]" />}
                              {test.status === "waiting" && <Clock className="h-4 w-4 text-yellow-400" />}
                            </div>
                            <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-3 border-t border-[#2B1F4A] bg-[#18122B]">
                              <div className="mb-2">
                                <div className="text-xs text-[#C2C2DD] mb-1">Input:</div>
                                <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">{test.input}</pre>
                              </div>
                              <div>
                                <div className="text-xs text-[#C2C2DD] mb-1">Expected Output:</div>
                                <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">
                                  {test.expectedOutput}
                                </pre>
                              </div>
                              {test.status === "failed" && (
                                <div className="mt-2 p-2 bg-[#E94560]/10 border border-[#E94560]/30 rounded">
                                  <div className="text-xs text-[#E94560] mb-1">Your Output:</div>
                                  <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">
                                    {test.id === 3 ? "[10, -5, 0, 20, 100]" : "No output"}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Bottom panel - Battle stats */}
      <div className="bg-[#231b3d] border-t border-[#271e3d] p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Battle Progress</h3>
            <div className="space-y-3">
              {/* Your progress */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32">
                  <div className="h-8 w-8 rounded-full bg-[#8A63D2] flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">You</span>
                </div>
                <div className="flex-1">
                  <Progress
                    value={userProgress}
                    className="h-2 bg-[#0D0A1A]"
                    indicatorClassName="bg-gradient-to-r from-[#7B3FBF] to-[#B689F4]"
                  />
                </div>
                <span className="text-sm font-mono w-12 text-right">{userProgress}%</span>
              </div>

              {/* Opponents progress */}
              {opponents.map((opponent) => (
                <div key={opponent.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32">
                    <img
                      src={opponent.avatar || "/placeholder.svg"}
                      alt={opponent.name}
                      className="h-8 w-8 rounded-full bg-[#2B1F4A]"
                    />
                    <span className="text-sm font-medium truncate">{opponent.name}</span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={opponent.progress}
                      className="h-2 bg-[#0D0A1A]"
                      indicatorClassName="bg-gradient-to-r from-[#545A91] to-[#8A63D2]/70"
                    />
                  </div>
                  <span className="text-sm font-mono w-12 text-right">{opponent.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ml-6 flex items-center gap-4">
          
            <Button variant="destructive" size="sm" className="bg-[#E94560] hover:bg-[#E94560]/80">
              Exit Battle
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

