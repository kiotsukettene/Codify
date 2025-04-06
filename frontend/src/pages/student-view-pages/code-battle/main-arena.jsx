"use client"

import { useState, useEffect, useRef } from "react"
import { Editor } from "@monaco-editor/react"
import {
  Clock,
  Play,
  Send,
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Trophy,
  User,
  Users,
  ArrowLeft,
  Expand,
  Minimize,
  Loader2,
  CheckCheck,
  ChevronUp,
  FileText,
  ListChecks,
  BarChart,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMarkdown from 'react-markdown'
// Sample problem data
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

// Sample test cases
const testCases = [
  { id: 1, input: "[5, 2, 9, 1, 5]", expectedOutput: "[1, 2, 5, 5, 9]", status: "waiting" },
  { id: 2, input: "[3, 1, 2]", expectedOutput: "[1, 2, 3]", status: "waiting" },
  { id: 3, input: "[10, -5, 0, 100, 20]", expectedOutput: "[-5, 0, 10, 20, 100]", status: "waiting" },
  { id: 4, input: "[7, 7, 7, 7]", expectedOutput: "[7, 7, 7, 7]", status: "waiting" },
]

// Update the opponents array to only have one opponent (2 players total)
const opponents = [
  {
    id: 1,
    name: "CodeNinja",
    avatar: "/placeholder.svg?height=40&width=40",
    progress: 75,
    score: 120,
    status: "typing", // typing, submitted, idle
  },
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
  const [userStatus, setUserStatus] = useState("idle") // idle, typing, submitted
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  // Collapsible panel states
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(false)
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false)
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(true)

  // Refs for scrollable elements
  const testCasesRef = useRef(null)
  const outputRef = useRef(null)
  const editorRef = useRef(null)

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle editor mounting
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  // Handle language change
  useEffect(() => {
    if (language === "javascript") {
      setCode(problemData.boilerplate.javascript)
    } else if (language === "python") {
      setCode(problemData.boilerplate.python)
    } else if (language === "java") {
      setCode(problemData.boilerplate.java)
    }
  }, [language])

  // Countdown timer
  useEffect(() => {
    let timer
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timeLeft])

  // Handle editor expansion with debounce to prevent resize observer issues
  useEffect(() => {
    // Force editor to remount after layout changes
    const timer = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isEditorExpanded, isProblemPanelOpen, isProgressPanelOpen, isOutputPanelOpen])

  // Set user status to typing when code changes
  useEffect(() => {
    if (code !== problemData.boilerplate[language]) {
      setUserStatus("typing")

      // Reset to idle after 2 seconds of inactivity
      const timer = setTimeout(() => {
        if (userStatus === "typing") {
          setUserStatus("idle")
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [code, language, userStatus])

  // Toggle editor expansion with debounce
  const toggleEditorExpansion = () => {
    // Increment key to force remount of editor
    setEditorKey((prev) => prev + 1)

    // Use setTimeout to avoid immediate state changes that could cause layout thrashing
    setTimeout(() => {
      setIsEditorExpanded((prev) => !prev)
    }, 10)
  }

  // Simulate running code
  const handleRunCode = () => {
    setIsRunning(true)
    setOutput("Running your code...")
    setActiveTab("output") // Switch to output tab
    setIsOutputPanelOpen(true) // Ensure output panel is open

    // Simulate processing delay
    setTimeout(() => {
      setOutput(
        "Code executed successfully!\n\nTest case #1: [5, 2, 9, 1, 5] → [1, 2, 5, 5, 9] ✓\n\nYour function correctly sorts the array.",
      )
      setIsRunning(false)

      // Update progress
      setUserProgress((prev) => Math.min(prev + 25, 100))

      // Show success animation
      setShowSuccessAnimation(true)
      setTimeout(() => setShowSuccessAnimation(false), 1500)
    }, 1500)
  }

  // Simulate submitting code
  const handleSubmitCode = () => {
    setIsRunning(true)
    setUserStatus("submitted")
    setOutput("Evaluating your solution against all test cases...")
    setIsOutputPanelOpen(true) // Ensure output panel is open

    // Simulate processing delay
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

      // Show success animation if all tests passed
      if (passedCount === totalCount) {
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1500)
      }
    }, 2000)
  }

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "typing":
        return (
          <span className="flex items-center text-blue-400">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Typing...
          </span>
        )
      case "submitted":
        return (
          <span className="flex items-center text-green-400">
            <CheckCheck className="h-3 w-3 mr-1" /> Submitted
          </span>
        )
      case "idle":
      default:
        return null
    }
  }

  // Get time color class based on time left
  const getTimeColorClass = () => {
    if (timeLeft < 60) return "text-red-500 animate-pulse font-bold"
    if (timeLeft < 300) return "text-red-400 font-bold"
    if (timeLeft < 600) return "text-yellow-400"
    return "text-gray-200"
  }

  return (
    <div className="flex flex-col h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden ">
      {/* Sticky header with essential info */}

      {!isEditorExpanded && (

      <header className="flex items-center justify-between px-3 py-2 bg-[#18122B] border-b border-[#2B1F4A] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-1 h-8 w-8 hover:bg-[#2B1F4A] rounded-full text-[#C2C2DD] hover:text-[#F5F5F5]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-bold flex items-center gap-1 truncate">
            <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <span className="truncate">{problemData.title}</span>
            <Badge variant="outline" className="ml-1 text-xs text-gray-300 bg-[#2B1F4A]/50 border-[#561e7b]">
              {problemData.points} pts
            </Badge>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="bg-[#231b3d] border border-[#2B1F4A] px-2 py-1 rounded text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#E94560]" />
              <span className={`font-mono text-sm ${getTimeColorClass()}`}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Players count */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 border-[#2B1F4A] hover:bg-[#2B1F4A] bg-[#231b3d] hover:text-[#F5F5F5]"
                  onClick={() => setIsProgressPanelOpen(!isProgressPanelOpen)}
                >
                  <Users className="h-3 w-3 mr-1" />
                  <span className="text-xs">{opponents.length + 1}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You and {opponents.length} others are in this battle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Exit button */}
          <Button variant="destructive" size="sm" className="h-7 px-4 bg-red-600/80 hover:bg-red-700 text-sm">
            Exit
          </Button>
        </div>
      </header>
      )}

      {/* Main content area - Vertical stack */}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Problem description panel - Collapsible */}
        {!isEditorExpanded && (

        <Collapsible
          open={isProblemPanelOpen}
          onOpenChange={setIsProblemPanelOpen}
          className="border-b border-[#2B1F4A]"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#B689F4]" />
              <span className="font-medium">Problem Description</span>
            </div>
            {isProblemPanelOpen ? (
              <Button variant='ghost'><ChevronUp className="h-4 w-4 text-[#C2C2DD]" /> Close</Button>
            ) : (
              <Button variant='ghost'><ChevronDown className="h-4 w-4 text-[#C2C2DD]" />Open</Button>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-[#18122B]">
            <div className="max-h-[30vh] overflow-y-auto">
              <Tabs defaultValue="description" className="p-3">
                <TabsList className="bg-[#0D0A1A] mb-3">
                  <TabsTrigger
                    value="description"
                    className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="examples"
                    className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                  >
                    Examples
                  </TabsTrigger>
                  <TabsTrigger
                    value="hints"
                    className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                  >
                    Hints
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{problemData.description}</ReactMarkdown>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="mt-0 space-y-3">
                  {problemData.examples.map((example, index) => (
                    <div key={index} className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                      <h3 className="font-semibold text-[#B689F4] mb-2 text-sm">Example {index + 1}</h3>

                      <div className="mb-2">
                        <div className="text-xs text-[#C2C2DD] mb-1">Input:</div>
                        <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-xs">{example.input}</pre>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs text-[#C2C2DD] mb-1">Output:</div>
                        <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-xs">{example.output}</pre>
                      </div>

                      {example.explanation && (
                        <div>
                          <div className="text-xs text-[#C2C2DD] mb-1">Explanation:</div>
                          <p className="text-xs">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="hints" className="mt-0">
                  <div className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                    <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-1 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      Hints
                    </h3>
                    <ul className="space-y-1">
                      {problemData.hints.map((hint, index) => (
                        <li key={index} className="flex items-start gap-1 text-xs">
                          <ChevronRight className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CollapsibleContent>
        </Collapsible>
          )}

        {/* Code editor - Dominant element */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Language selector */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#18122B] border-b border-[#2B1F4A]">
            <div className="flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0D0A1A] text-[#F5F5F5] border border-[#2B1F4A] rounded px-2 py-1 text-xs"
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
                className="h-7 px-2 text-xs border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
              >
                Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-primary text-white border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={toggleEditorExpansion}
              >
                {isEditorExpanded ? <Minimize className="h-3 w-3 mr-1" /> : <Expand className="h-3 w-3 mr-1" />}
                {isEditorExpanded ? "Exit" : "Fullscreen"}
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

          {/* Action buttons */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#18122B] border-t border-b border-[#2B1F4A]">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                size="sm"
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
                Run
              </Button>
              <Button
                onClick={handleSubmitCode}
                disabled={isRunning}
                className="bg-[#E94560] hover:bg-[#E94560]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                size="sm"
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                Submit
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-[#2B1F4A]"
                onClick={() => setIsOutputPanelOpen(!isOutputPanelOpen)}
              >
                {isOutputPanelOpen ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1" />}
                {isOutputPanelOpen ? "Hide Output" : "Show Output"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-[#2B1F4A]"
                onClick={() => setIsProgressPanelOpen(!isProgressPanelOpen)}
              >
                {isProgressPanelOpen ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronUp className="h-3 w-3 mr-1" />
                )}
                {isProgressPanelOpen ? "Hide Progress" : "Show Progress"}
              </Button>
            </div>
          </div>
        </div>

        {/* Output panel - Collapsible */}
        <Collapsible open={isOutputPanelOpen} onOpenChange={setIsOutputPanelOpen} className="border-t border-[#2B1F4A]">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors md:hidden">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#B689F4]" />
              <span className="font-medium">Output & Test Cases</span>
            </div>
            {isOutputPanelOpen ? (
              <ChevronUp className="h-4 w-4 text-[#C2C2DD]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-[#18122B]">
            <div className="h-[25vh] flex flex-col">
              <Tabs defaultValue="output" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center px-3 py-1 bg-[#18122B]">
                  <TabsList className="bg-[#0D0A1A] h-7">
                    <TabsTrigger
                      value="output"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs h-6"
                    >
                      Output
                    </TabsTrigger>
                    <TabsTrigger
                      value="testcases"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs h-6"
                    >
                      Test Cases
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="output" className="flex-1 p-0 m-0 h-full">
                  <div className="h-full">
                    <pre
                      ref={outputRef}
                      className="bg-[#1E1B38] text-[#C2C2DD] p-3 h-full overflow-auto font-mono text-xs"
                    >
                      {output || "Run your code to see output here..."}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="testcases" className="flex-1 p-0 m-0 h-full">
                  <div className="h-full overflow-hidden">
                    <div ref={testCasesRef} className="bg-[#1E1B38] h-full overflow-auto p-2">
                      {testResults.map((test) => (
                        <div key={test.id} className="border border-[#2B1F4A] rounded-lg overflow-hidden mb-2">
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-[#18122B] transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">Test #{test.id}</span>
                                {test.status === "passed" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-500/20 text-green-400 border-green-500 text-xs py-0 h-5"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" /> Passed
                                  </Badge>
                                )}
                                {test.status === "failed" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/20 text-red-400 border-red-500 text-xs py-0 h-5"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" /> Failed
                                  </Badge>
                                )}
                                {test.status === "waiting" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500 text-xs py-0 h-5"
                                  >
                                    <Clock className="h-3 w-3 mr-1" /> Waiting
                                  </Badge>
                                )}
                              </div>
                              <ChevronDown className="h-3 w-3 text-[#C2C2DD]" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-2 border-t border-[#2B1F4A] bg-[#18122B]">
                                <div className="mb-2">
                                  <div className="text-xs text-[#C2C2DD] mb-1">Input:</div>
                                  <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">{test.input}</pre>
                                </div>
                                <div className="mb-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Battle progress panel - Collapsible */}
        <Collapsible
          open={isProgressPanelOpen}
          onOpenChange={setIsProgressPanelOpen}
          className="border-t border-[#2B1F4A]"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors md:hidden">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-[#B689F4]" />
              <span className="font-medium">Battle Progress</span>
            </div>
            {isProgressPanelOpen ? (
              <ChevronUp className="h-4 w-4 text-[#C2C2DD]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-[#231b3d]">
            <div className="p-3 space-y-3">
              {/* Your progress */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32">
                  <div className="h-6 w-6 rounded-full bg-[#8A63D2] flex items-center justify-center relative">
                    <User className="h-3 w-3" />
                    {userStatus !== "idle" && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${userStatus === "typing" ? "bg-blue-400" : "bg-green-400"} opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${userStatus === "typing" ? "bg-blue-500" : "bg-green-500"}`}
                        ></span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">You</span>
                    {getStatusIcon(userStatus)}
                  </div>
                </div>
                <div className="flex-1">
                  <Progress
                    value={userProgress}
                    className="h-2 bg-[#0D0A1A]"
                    indicatorClassName="bg-gradient-to-r from-[#7B3FBF] to-[#B689F4]"
                  />
                </div>
                <span className="text-xs font-mono w-8 text-right font-bold">{userProgress}%</span>
              </div>

              {/* Opponents progress */}
              {opponents.map((opponent) => (
                <div key={opponent.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32">
                    <div className="relative">
                      <img
                        src={opponent.avatar || "/placeholder.svg"}
                        alt={opponent.name}
                        className="h-6 w-6 rounded-full bg-[#2B1F4A] border border-[#2B1F4A]"
                      />
                      {opponent.status !== "idle" && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${opponent.status === "typing" ? "bg-blue-400" : "bg-green-400"} opacity-75`}
                          ></span>
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${opponent.status === "typing" ? "bg-blue-500" : "bg-green-500"}`}
                          ></span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium truncate">{opponent.name}</span>
                      {getStatusIcon(opponent.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={opponent.progress}
                      className="h-2 bg-[#0D0A1A]"
                      indicatorClassName="bg-gradient-to-r from-[#545A91] to-[#8A63D2]/70"
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right font-bold">{opponent.progress}%</span>
                </div>
              ))}

              <div className="flex justify-center pt-1">
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  View Leaderboard
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

