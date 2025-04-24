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
  Lock,
  ArrowRight,
  CheckSquare,
  Unlock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "react-router-dom"
import useBattleStore from "@/store/battleStore"



// Mock data for backend integration
const mockUserData = {
  id: "user123",
  name: "Player1",
  totalScore: 0,
  completedChallenges: [],
  submissionHistory: [],
}

// Mock API endpoints for backend integration
const mockApiEndpoints = {
  submitChallenge: "/api/challenges/submit",
  getChallenge: "/api/challenges/:id",
  getUserProgress: "/api/users/:id/progress",
  updateUserScore: "/api/users/:id/score",
}



export default function CodeBattle() {

  const { battleCode } = useParams()

  const { fetchBattleDetails, battleDetails, isLoadingBattleDetails, battleDetailsError } = useBattleStore();
  // Battle state
  const [battleTitle, setBattleTitle] = useState("Algorithmic Coding Battle")
  const [challengesData, setChallengesData] = useState([]); // Replace static challengesData with state
  const [opponents, setOpponents] = useState([]);
  // Challenge state
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [challengeResults, setChallengeResults] = useState([])
  const [unlockedChallenges, setUnlockedChallenges] = useState([1]) // Only first challenge is unlocked initially

  // Current challenge data
  const currentChallenge = challengesData[currentChallengeIndex] || {
    boilerplate: { javascript: "", python: "", java: "" },
    testCases: [],
    timeLimit: 1800,
    title: "",
    points: 0,
    description: "",
    examples: [],
    hints: [],
  };

  // Editor state
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(currentChallenge.boilerplate.javascript)
  const [output, setOutput] = useState("")
  const [testResults, setTestResults] = useState(currentChallenge.testCases)
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimit)
  const [isRunning, setIsRunning] = useState(false)
  const [userProgress, setUserProgress] = useState(0)
  const [theme, setTheme] = useState("vs-dark")
  const [isEditorExpanded, setIsEditorExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("output")
  const [editorKey, setEditorKey] = useState(0) // Key to force editor remount
  const [userStatus, setUserStatus] = useState("idle") // idle, typing, submitted
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isEditorReadOnly, setIsEditorReadOnly] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showNextChallengeButton, setShowNextChallengeButton] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  // Collapsible panel states
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(false)
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false)
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(false)
  const [isChallenge3Open, setIsChallenge3Open] = useState(false)

  // Refs for scrollable elements
  const testCasesRef = useRef(null)
  const outputRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    const loadBattleDetails = async () => {
      try {
        if (battleCode) {
          const data = await fetchBattleDetails(battleCode);
          // Map backend challenges to frontend format
          const formattedChallenges = data.challenges.map((challenge, index) => ({
            id: index + 1,
            title: challenge.problemTitle,
            points: challenge.points,
            timeLimit: Math.floor(data.duration * 60 / data.challenges.length),
            description: challenge.problemDescription,
            examples: challenge.inputConstraints.map((input, i) => ({
              input,
              output: challenge.expectedOutput[i],
              explanation: `Example ${i + 1}`,
            })),
            hints: [],
            boilerplate: {
              javascript: `function solution() {\n  // Your code here\n}`,
              python: `def solution():\n    # Your code here\n    pass`,
              java: `public class Solution {\n    public static void solution() {\n        // Your code here\n    }\n}`,
            },
            testCases: challenge.inputConstraints.map((input, i) => ({
              id: i + 1,
              input,
              expectedOutput: challenge.expectedOutput[i],
              status: "waiting",
            })),
          }));
          setChallengesData(formattedChallenges);
          setBattleTitle(data.title);
          // Update opponents based on fetched players
          setOpponents([
            {
              id: data.player2.id,
              name: data.player2.name,
              avatar: "/placeholder.svg?height=40&width=40",
              progress: 75, // Update dynamically if backend provides progress
              score: 120,
              status: "idle",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch battle details:", error);
        // Fallback to static challengesData and opponents
        setChallengesData(challengesData); // Use the imported static challengesData
        setOpponents([
          {
            id: 1,
            name: "CodeNinja",
            avatar: "/placeholder.svg?height=40&width=40",
            progress: 75,
            score: 120,
            status: "typing",
          },
        ]);
      }
    };
  
    loadBattleDetails();
  }, [battleCode, fetchBattleDetails]);

  useEffect(() => {
    console.log(battleDetails)
  }, [battleDetails])

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
      setCode(currentChallenge.boilerplate.javascript)
    } else if (language === "python") {
      setCode(currentChallenge.boilerplate.python)
    } else if (language === "java") {
      setCode(currentChallenge.boilerplate.java)
    }
  }, [language, currentChallenge])

  // Reset state when challenge changes
  useEffect(() => {
    setCode(currentChallenge.boilerplate[language])
    setTestResults(currentChallenge.testCases)
    setTimeLeft(currentChallenge.timeLimit)
    setOutput("")
    setUserProgress(0)
    setIsEditorReadOnly(false)
    setIsSubmitted(false)
    setShowNextChallengeButton(false)
    setUserStatus("idle")
    setIsProblemPanelOpen(true)
  }, [currentChallengeIndex, currentChallenge, language])

  // Countdown timer
  useEffect(() => {
    let timer
    if (timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timeLeft, isSubmitted])

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
    if (code !== currentChallenge.boilerplate[language] && !isEditorReadOnly) {
      setUserStatus("typing")

      // Reset to idle after 2 seconds of inactivity
      const timer = setTimeout(() => {
        if (userStatus === "typing") {
          setUserStatus("idle")
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [code, language, userStatus, isEditorReadOnly, currentChallenge.boilerplate])

  // Toggle editor expansion with debounce
  const toggleEditorExpansion = () => {
    // Increment key to force remount of editor
    setEditorKey((prev) => prev + 1)

    // Use setTimeout to avoid immediate state changes that could cause layout thrashing
    setTimeout(() => {
      setIsEditorExpanded((prev) => !prev)
    }, 10)
  }

  // Check if a challenge is unlocked
  const isChallengeUnlocked = (challengeId) => {
    return unlockedChallenges.includes(challengeId)
  }

  // Run code and evaluate test cases
  const handleRunCode = () => {
    setIsRunning(true)
    setOutput("Running your code and evaluating test cases...")
    setIsOutputPanelOpen(true) // Ensure output panel is open
    setUserStatus("submitted")

    // Simulate processing delay
    setTimeout(() => {
      // Update test results
      let updatedResults

      // For Challenge 3, ensure at least one test fails
      if (currentChallengeIndex === 2) {
        updatedResults = testResults.map((test, index) => ({
          ...test,
          // Make sure at least test #2 fails for Challenge 3
          status: index === 1 ? "failed" : Math.random() > 0.3 ? "passed" : "failed",
        }))
      } else {
        updatedResults = testResults.map((test) => ({
          ...test,
          status: Math.random() > 0.3 ? "passed" : "failed", // Randomly pass/fail for demo
        }))
      }

      setTestResults(updatedResults)

      const passedCount = updatedResults.filter((t) => t.status === "passed").length
      const totalCount = updatedResults.length

      // Generate detailed output
      let outputText = `Code execution completed!\n\n`
      outputText += `Test Results: ${passedCount}/${totalCount} test cases passed.\n\n`

      updatedResults.forEach((test) => {
        outputText += `Test #${test.id}: ${test.input} → ${
          test.status === "passed"
            ? test.expectedOutput + " ✓"
            : (test.id === 3 ? "Incorrect output" : "No output") + " ✗"
        }\n`
      })

      setOutput(outputText)
      setIsRunning(false)

      // Update progress based on passed tests
      setUserProgress(Math.round((passedCount / totalCount) * 100))

      // Show success animation if all tests passed
      if (passedCount === totalCount) {
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1500)
      }
    }, 1500)
  }

  // Handle submit code
  const handleSubmitCode = () => {
    setIsSubmitModalOpen(true)
  }

  // Handle finalize submission
  const handleFinalizeSubmission = () => {
    setIsSubmitModalOpen(false)
    setIsEditorReadOnly(true)
    setIsSubmitted(true)
    setUserStatus("submitted")

    // Calculate results
    const passedCount = testResults.filter((t) => t.status === "passed").length
    const totalCount = testResults.length
    const score = Math.round((passedCount / totalCount) * currentChallenge.points)

    // Store challenge result
    const result = {
      challengeId: currentChallenge.id,
      title: currentChallenge.title,
      passedTests: passedCount,
      totalTests: totalCount,
      score: score,
      timeSpent: currentChallenge.timeLimit - timeLeft,
    }

    // Only add to challenge results if all tests passed
    if (passedCount === totalCount) {
      setChallengeResults([...challengeResults, result])
    }

    // Special case for Challenge 3 (index 2) - Always show error
    if (currentChallengeIndex === 2) {
      setIsErrorModalOpen(true)
      return
    }

    // Check if all tests passed before allowing to proceed
    if (passedCount === totalCount) {
      // Add to completed challenges
      setCompletedChallenges([...completedChallenges, currentChallenge.id])

      // Unlock next challenge if available
      if (currentChallengeIndex < challengesData.length - 1) {
        const nextChallengeId = challengesData[currentChallengeIndex + 1].id
        if (!unlockedChallenges.includes(nextChallengeId)) {
          setUnlockedChallenges([...unlockedChallenges, nextChallengeId])
        }
        setShowNextChallengeButton(true)
      }
    } else {
      // Show error modal if not all tests passed
      setIsErrorModalOpen(true)
    }

    // Mock API call to submit challenge
    console.log("Submitting challenge to:", mockApiEndpoints.submitChallenge, {
      userId: mockUserData.id,
      challengeId: currentChallenge.id,
      code: code,
      language: language,
      testResults: testResults,
      score: score,
      timeSpent: currentChallenge.timeLimit - timeLeft,
    })
  }

  // Handle moving to next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < challengesData.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1)
    }
  }

  // Handle selecting a challenge from dropdown (for challenge 3)
  const handleSelectChallenge = (index) => {
    if (isChallengeUnlocked(challengesData[index].id)) {
      setCurrentChallengeIndex(index)
    }
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

  

  // Get challenge status badge
  const getChallengeStatusBadge = (challengeId, index) => {
    if (completedChallenges.includes(challengeId)) {
      return (
        <Badge variant="outline" className="ml-1 bg-green-500/20 text-green-400 border-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>
      )
    }

    if (index === currentChallengeIndex) {
      return (
        <Badge variant="outline" className="ml-1 bg-blue-500/20 text-blue-400 border-blue-500">
          Current
        </Badge>
      )
    }

    if (isChallengeUnlocked(challengeId)) {
      return (
        <Badge variant="outline" className="ml-1 bg-yellow-500/20 text-yellow-400 border-yellow-500">
          <Unlock className="h-3 w-3 mr-1" /> Unlocked
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="ml-1 bg-gray-500/20 text-gray-400 border-gray-500">
        <Lock className="h-3 w-3 mr-1" /> Locked
      </Badge>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden">
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
              <span className="truncate">{battleTitle}</span>
            </h1>
          </div>

          

          <div className="flex items-center gap-2">
            {/* Challenge selector */}
            <div className="bg-[#231b3d] border border-[#2B1F4A] rounded">
              {currentChallengeIndex === 2 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2 text-sm">
                      Challenge {currentChallengeIndex + 1} / {challengesData.length}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#231b3d] border border-[#2B1F4A]">
                    {challengesData.map((challenge, index) => (
                      <DropdownMenuItem
                        key={challenge.id}
                        disabled={!isChallengeUnlocked(challenge.id)}
                        onClick={() => handleSelectChallenge(index)}
                        className={`flex items-center justify-between ${
                          !isChallengeUnlocked(challenge.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        } ${index === currentChallengeIndex ? "bg-[#2B1F4A]" : ""}`}
                      >
                        <div className="flex items-center">
                          {!isChallengeUnlocked(challenge.id) && <Lock className="h-3 w-3 mr-1" />}
                          Challenge {index + 1}: {challenge.title.substring(0, 15)}...
                        </div>
                        {getChallengeStatusBadge(challenge.id, index)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="px-2 py-1 text-sm flex items-center">
                  <span>
                    Challenge {currentChallengeIndex + 1} / {challengesData.length}
                  </span>
                </div>
              )}
            </div>

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
        {/* Challenge navigation bar */}
        {!isEditorExpanded && (
          <div className="flex items-center justify-between px-3 py-2 bg-[#231b3d] border-b border-[#2B1F4A]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">{currentChallenge.title}</h2>
              <Badge variant="outline" className="text-xs text-gray-300 bg-[#2B1F4A]/50 border-[#561e7b]">
                {currentChallenge.points} pts
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Challenge navigation buttons */}
              {challengesData.map((challenge, index) => (
                <Button
                  key={challenge.id}
                  variant={index === currentChallengeIndex ? "default" : "outline"}
                  size="sm"
                  disabled={!isChallengeUnlocked(challenge.id)}
                  onClick={() => handleSelectChallenge(index)}
                  className={`h-7 px-3 ${
                    index === currentChallengeIndex
                      ? "bg-[#B689F4] text-[#0D0A1A]"
                      : "border-[#2B1F4A] bg-[#18122B] text-[#C2C2DD]"
                  } ${!isChallengeUnlocked(challenge.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {!isChallengeUnlocked(challenge.id) && <Lock className="h-3 w-3 mr-1" />}
                  {index === 2 ? (
                    <span className="flex items-center">
                      Challenge {index + 1} <ChevronDown className="h-3 w-3 ml-1" />
                    </span>
                  ) : (
                    <span>Challenge {index + 1}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

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
                <Button variant="ghost">
                  <ChevronUp className="h-4 w-4 text-[#C2C2DD]" /> Close
                </Button>
              ) : (
                <Button variant="ghost">
                  <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
                  Open
                </Button>
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
                  </TabsList>

                  <TabsContent value="description" className="mt-0 bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                    <div className="space-y-4 p-2">
                      <h2 className="text-lg font-semibold">Problem Description</h2>
                      <p className="text-sm text-[#C2C2DD]">{currentChallenge.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-0 space-y-3">
                    {currentChallenge.examples.map((example, index) => (
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
                disabled={isEditorReadOnly}
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
                  readOnly: isEditorReadOnly,
                }}
              />
              {isSubmitted && showNextChallengeButton && (
                <div className="absolute inset-0 bg-[#0D0A1A]/70 flex flex-col items-center justify-center z-10">
                  <div className="bg-[#231b3d] border border-[#2B1F4A] rounded-lg p-6 max-w-md text-center">
                    <CheckSquare className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Challenge Completed!</h3>
                    <p className="text-[#C2C2DD] mb-4">
                      You've completed Challenge {currentChallengeIndex + 1}. Ready for the next one?
                    </p>
                    <div className="flex justify-center">
                      <Button className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white" onClick={handleNextChallenge}>
                        <ArrowRight className="h-4 w-4 mr-1" /> Next Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#18122B] border-t border-b border-[#2B1F4A]">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning || isEditorReadOnly}
                className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                size="sm"
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
                Run Code
              </Button>

              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isEditorReadOnly}
                  className="bg-[#E94560] hover:bg-[#E94560]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </Button>
              ) : (
                <Button disabled className="bg-[#2B1F4A] text-[#C2C2DD] h-8 cursor-not-allowed" size="sm">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Submitted
                </Button>
              )}
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
              <Tabs
                defaultValue="output"
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col h-full"
              >
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

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="output" className="p-0 m-0 h-full">
                    <pre
                      ref={outputRef}
                      className="bg-[#1E1B38] text-[#C2C2DD] p-3 h-full overflow-auto font-mono text-xs"
                    >
                      {output || "Run your code to see output here..."}
                    </pre>
                  </TabsContent>

                  <TabsContent value="testcases" className="p-0 m-0 h-full overflow-auto">
                    <div className="bg-[#1E1B38] p-2">
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
                                      {test.id === 3 ? "Incorrect output" : "No output"}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
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
              {/* Challenge progress */}
              <div className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A] mb-3">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Challenge Progress
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {challengesData.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className={`p-2 rounded-md text-center ${
                        index === currentChallengeIndex
                          ? "bg-[#2B1F4A] border border-[#B689F4]"
                          : completedChallenges.includes(challenge.id)
                            ? "bg-[#14AE5C]/20 border border-[#14AE5C]/50"
                            : isChallengeUnlocked(challenge.id)
                              ? "bg-[#18122B] border border-[#2B1F4A]"
                              : "bg-[#18122B] border border-[#2B1F4A] opacity-50"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">Challenge {index + 1}</div>
                      {completedChallenges.includes(challenge.id) && (
                        <CheckCircle className="h-3 w-3 text-green-400 mx-auto" />
                      )}
                      {index === currentChallengeIndex && !completedChallenges.includes(challenge.id) && (
                        <div className="text-xs text-[#B689F4]">Current</div>
                      )}
                      {!isChallengeUnlocked(challenge.id) && !completedChallenges.includes(challenge.id) && (
                        <Lock className="h-3 w-3 text-[#C2C2DD] mx-auto" />
                      )}
                      {isChallengeUnlocked(challenge.id) &&
                        index !== currentChallengeIndex &&
                        !completedChallenges.includes(challenge.id) && (
                          <div className="text-xs text-[#C2C2DD]">Unlocked</div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

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

              {/* Challenge results summary */}
              {challengeResults.length > 0 && (
                <div className="mt-4 bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                  <h3 className="text-sm font-semibold mb-2">Challenge Results</h3>
                  <div className="space-y-2">
                    {challengeResults.map((result) => (
                      <div
                        key={result.challengeId}
                        className="flex justify-between items-center text-xs p-2 bg-[#18122B] rounded"
                      >
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>{result.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#C2C2DD]">
                            {result.passedTests}/{result.totalTests} tests
                          </span>
                          <span className="font-medium text-yellow-400">+{result.score} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Submit Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="bg-[#18122B] border border-[#2B1F4A] text-[#F5F5F5] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Final Submission
            </DialogTitle>
            <DialogDescription className="text-[#C2C2DD]">
              Are you ready to submit your solution for Challenge {currentChallengeIndex + 1}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-[#0D0A1A] rounded-lg p-4 border border-[#2B1F4A]">
              <p className="text-sm text-[#F5F5F5]">Once you finalize your submission:</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Lock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Your code will be locked and become read-only</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckSquare className="h-4 w-4 text-[#B689F4] mt-0.5 flex-shrink-0" />
                  <span>Your solution will be evaluated and scored</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>You'll be able to proceed to the next challenge if all tests pass</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsSubmitModalOpen(false)}
              className="text-neutral-900 hover:text-neutral-200 border-[#2B1F4A] hover:bg-[#2B1F4A]"
            >
              Cancel
            </Button>
            <Button onClick={handleFinalizeSubmission} className="bg-[#E94560] hover:bg-[#E94560]/80 text-white">
              <CheckSquare className="h-4 w-4 mr-1" /> Finalize Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="bg-[#18122B] border border-[#2B1F4A] text-[#F5F5F5] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-400" />🛑 Challenge Locked!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-[#0D0A1A] rounded-lg p-4 border border-red-500/30">
              <p className="text-lg text-center font-bold mb-2">🕹️Fix the Error to Continue</p>
              <p className="text-center text-sm mb-2">You've hit a roadblock — there's still an error in this challenge.</p>
              <p className="text-center text-sm text-yellow-400">
                🧩 Solve it to unlock the next level and keep progressing on your quest!
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setIsErrorModalOpen(false)
                setIsEditorReadOnly(false)
                setIsSubmitted(false)
              }}
              className="bg-[#E94560] hover:bg-[#E94560]/80 text-white w-full"
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
