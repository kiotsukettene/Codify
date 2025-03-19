"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Code,
  BarChart,
  ArrowLeft,
  RefreshCw,
  Eye,
  Users,
  Star,
  ChevronDown,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

// Sample battle results data
const battleResults = {
  title: "Data Sorting Challenge",
  difficulty: "Medium",
  placement: 2,
  totalCompetitors: 4,
  xpEarned: 150,
  pointsEarned: 75,
  timeTaken: "12:45",
  averageTime: "10:30",
  testCases: {
    passed: 3,
    total: 4,
    failed: [
      {
        id: 3,
        input: "[10, -5, 0, 100, 20]",
        expectedOutput: "[-5, 0, 10, 20, 100]",
        userOutput: "[10, -5, 0, 20, 100]",
        feedback: "Your solution doesn't correctly sort negative numbers.",
      },
    ],
  },
  executionSpeed: {
    time: "2.1s",
    rating: "Good",
    percentile: 65,
  },
  codeEfficiency: {
    rating: "Needs Improvement",
    feedback:
      "Your solution has a time complexity of O(n²). Consider using a more efficient sorting algorithm like quicksort or mergesort for better performance.",
    percentile: 40,
  },
  userCode: `function sortArray(arr) {
  // Bubble sort implementation
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  optimalCode: `function sortArray(arr) {
  // Using JavaScript's built-in sort with a compare function
  return arr.sort((a, b) => a - b);
}`,
  professorFeedback:
    "Your bubble sort implementation works correctly for most cases, but it's not the most efficient approach. JavaScript's built-in sort method would be more efficient for this problem. Also, be careful with edge cases like negative numbers.",
  levelProgress: {
    currentLevel: 4,
    currentXP: 350,
    xpForNextLevel: 500,
  },
  competitors: [
    { name: "AlgorithmAce", placement: 1, time: "08:30", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "You", placement: 2, time: "12:45", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "CodeNinja", placement: 3, time: "14:20", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "ByteMaster", placement: 4, time: "15:45", avatar: "/placeholder.svg?height=40&width=40" },
  ],
}

export default function PostBattleSummary() {
  const [xpProgress, setXpProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("performance")
  const [showOptimalCode, setShowOptimalCode] = useState(false)

  // Calculate XP progress percentage
  const xpPercentage = Math.round(
    (battleResults.levelProgress.currentXP / battleResults.levelProgress.xpForNextLevel) * 100,
  )
  const xpAfterBattle = Math.round(
    ((battleResults.levelProgress.currentXP + battleResults.xpEarned) / battleResults.levelProgress.xpForNextLevel) *
      100,
  )

  // Trigger confetti effect for winners
  useEffect(() => {
    if (battleResults.placement <= 3) {
      setShowConfetti(true)

      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const colors = ["#7B3FBF", "#B689F4", "#E94560"]

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const runConfetti = () => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
          disableForReducedMotion: true,
        })

        requestAnimationFrame(runConfetti)
      }

      runConfetti()

      // Clean up
      return () => {
        setShowConfetti(false)
      }
    }
  }, [])

  // Animate XP progress
  useEffect(() => {
    // Start from current XP
    setXpProgress(xpPercentage)

    // Animate to new XP after a delay
    const timer = setTimeout(() => {
      setXpProgress(xpAfterBattle)
    }, 1000)

    return () => clearTimeout(timer)
  }, [xpPercentage, xpAfterBattle])

  // Get placement suffix
  const getPlacementSuffix = (place) => {
    if (place === 1) return "st"
    if (place === 2) return "nd"
    if (place === 3) return "rd"
    return "th"
  }

  // Get placement color
  const getPlacementColor = (place) => {
    if (place === 1) return "text-yellow-400"
    if (place === 2) return "text-gray-300"
    if (place === 3) return "text-amber-600"
    return "text-gray-400"
  }

  // Get placement glow
  const getPlacementGlow = (place) => {
    if (place === 1) return "shadow-[0_0_15px_rgba(250,204,21,0.5)]"
    if (place === 2) return "shadow-[0_0_10px_rgba(209,213,219,0.3)]"
    if (place === 3) return "shadow-[0_0_10px_rgba(217,119,6,0.3)]"
    return ""
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden">
      {/* Header - Summary Section */}
      <header className="px-6 py-8 bg-[#18122B] border-b border-[#2B1F4A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                <Trophy className="h-8 w-8 text-yellow-400" />
                Battle Completed! 🎉
              </h1>
              <p className="text-[#C2C2DD] text-lg">
                {battleResults.title} •{" "}
                <Badge variant="outline" className="bg-[#2B1F4A] text-[#B689F4] border-[#8A63D2]">
                  {battleResults.difficulty}
                </Badge>
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-4 md:mt-0 border-[#2B1F4A] hover:bg-[#2B1F4A] text-[#C2C2DD] hover:text-[#F5F5F5]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placement */}
            <div className="bg-[#0D0A1A] rounded-xl p-6 border border-[#2B1F4A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#C2C2DD]">Your Placement</h3>
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`text-7xl font-bold ${getPlacementColor(battleResults.placement)} ${getPlacementGlow(battleResults.placement)}`}
                >
                  {battleResults.placement}
                  <span className="text-2xl">{getPlacementSuffix(battleResults.placement)}</span>
                </motion.div>
              </div>

              <p className="text-center mt-4 text-[#C2C2DD]">out of {battleResults.totalCompetitors} competitors</p>
            </div>

            {/* XP Earned */}
            <div className="bg-[#0D0A1A] rounded-xl p-6 border border-[#2B1F4A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#C2C2DD]">XP Earned</h3>
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-5xl font-bold text-[#B689F4]"
                >
                  +{battleResults.xpEarned}
                </motion.div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#C2C2DD]">Level {battleResults.levelProgress.currentLevel}</span>
                  <span className="text-sm text-[#C2C2DD]">
                    {battleResults.levelProgress.currentXP + battleResults.xpEarned}/
                    {battleResults.levelProgress.xpForNextLevel} XP
                  </span>
                </div>
                <div className="relative h-2 bg-[#2B1F4A] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${xpPercentage}%` }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-[#7B3FBF] to-[#B689F4]"
                  />
                </div>
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-[#0D0A1A] rounded-xl p-6 border border-[#2B1F4A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#C2C2DD]">Time Taken</h3>
                <Clock className="h-5 w-5 text-[#E94560]" />
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-5xl font-bold text-[#E94560]"
                >
                  {battleResults.timeTaken}
                </motion.div>
              </div>

              <p className="text-center mt-4 text-[#C2C2DD]">Average: {battleResults.averageTime}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Performance Breakdown */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#0D0A1A] mb-6">
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
              >
                Code Review
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD]"
              >
                Leaderboard
              </TabsTrigger>
            </TabsList>

            {/* Performance Tab */}
            <TabsContent value="performance" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test Cases */}
                <div className="bg-[#18122B] rounded-xl p-6 border border-[#2B1F4A]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Test Case Results</h3>
                    <Badge
                      variant="outline"
                      className={`${
                        battleResults.testCases.passed === battleResults.testCases.total
                          ? "bg-[#14AE5C]/10 text-[#14AE5C] border-[#14AE5C]/30"
                          : "bg-[#E94560]/10 text-[#E94560] border-[#E94560]/30"
                      }`}
                    >
                      {battleResults.testCases.passed}/{battleResults.testCases.total} Passed
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {battleResults.testCases.failed.map((test) => (
                      <Collapsible key={test.id} className="border border-[#2B1F4A] rounded-lg overflow-hidden">
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-[#0D0A1A] transition-colors">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-[#E94560]" />
                            <span className="font-medium">Test Case #{test.id} Failed</span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 border-t border-[#2B1F4A] bg-[#0D0A1A]">
                            <div className="mb-3">
                              <div className="text-sm text-[#C2C2DD] mb-1">Input:</div>
                              <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-sm">{test.input}</pre>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm text-[#C2C2DD] mb-1">Expected Output:</div>
                              <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-sm">
                                {test.expectedOutput}
                              </pre>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm text-[#E94560] mb-1">Your Output:</div>
                              <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-sm">{test.userOutput}</pre>
                            </div>

                            <div>
                              <div className="text-sm text-[#C2C2DD] mb-1">Feedback:</div>
                              <p className="text-sm bg-[#1E1B38] p-2 rounded">{test.feedback}</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}

                    {battleResults.testCases.passed > 0 && (
                      <Collapsible className="border border-[#2B1F4A] rounded-lg overflow-hidden">
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-[#0D0A1A] transition-colors">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-[#14AE5C]" />
                            <span className="font-medium">{battleResults.testCases.passed} Test Cases Passed</span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 border-t border-[#2B1F4A] bg-[#0D0A1A]">
                            <p className="text-[#C2C2DD]">
                              Great job! You passed {battleResults.testCases.passed} out of{" "}
                              {battleResults.testCases.total} test cases.
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-[#18122B] rounded-xl p-6 border border-[#2B1F4A]">
                  <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>

                  <div className="space-y-6">
                    {/* Execution Speed */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-400" />
                          <h4 className="font-medium">Execution Speed</h4>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            battleResults.executionSpeed.percentile > 70
                              ? "bg-[#14AE5C]/10 text-[#14AE5C] border-[#14AE5C]/30"
                              : battleResults.executionSpeed.percentile > 40
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                                : "bg-[#E94560]/10 text-[#E94560] border-[#E94560]/30"
                          }`}
                        >
                          {battleResults.executionSpeed.rating}
                        </Badge>
                      </div>

                      <div className="bg-[#0D0A1A] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#C2C2DD]">Execution Time:</span>
                          <span className="font-mono">{battleResults.executionSpeed.time}</span>
                        </div>

                        <div className="mb-1">
                          <span className="text-sm text-[#C2C2DD]">Percentile Rank:</span>
                        </div>
                        <div className="relative h-2 bg-[#2B1F4A] rounded-full overflow-hidden mb-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${battleResults.executionSpeed.percentile}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`absolute h-full ${
                              battleResults.executionSpeed.percentile > 70
                                ? "bg-gradient-to-r from-green-500 to-green-400"
                                : battleResults.executionSpeed.percentile > 40
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                  : "bg-gradient-to-r from-red-500 to-red-400"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#C2C2DD]">
                          <span>Slower</span>
                          <span>Faster</span>
                        </div>
                      </div>
                    </div>

                    {/* Code Efficiency */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-[#B689F4]" />
                          <h4 className="font-medium">Code Efficiency</h4>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            battleResults.codeEfficiency.percentile > 70
                              ? "bg-[#14AE5C]/10 text-[#14AE5C] border-[#14AE5C]/30"
                              : battleResults.codeEfficiency.percentile > 40
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                                : "bg-[#E94560]/10 text-[#E94560] border-[#E94560]/30"
                          }`}
                        >
                          {battleResults.codeEfficiency.rating}
                        </Badge>
                      </div>

                      <div className="bg-[#0D0A1A] rounded-lg p-4">
                        <p className="text-[#C2C2DD] mb-3">{battleResults.codeEfficiency.feedback}</p>

                        <div className="mb-1">
                          <span className="text-sm text-[#C2C2DD]">Efficiency Ranking:</span>
                        </div>
                        <div className="relative h-2 bg-[#2B1F4A] rounded-full overflow-hidden mb-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${battleResults.codeEfficiency.percentile}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className={`absolute h-full ${
                              battleResults.codeEfficiency.percentile > 70
                                ? "bg-gradient-to-r from-green-500 to-green-400"
                                : battleResults.codeEfficiency.percentile > 40
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                  : "bg-gradient-to-r from-red-500 to-red-400"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#C2C2DD]">
                          <span>Less Efficient</span>
                          <span>More Efficient</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Code Review Tab */}
            <TabsContent value="code" className="mt-0">
              <div className="bg-[#18122B] rounded-xl p-6 border border-[#2B1F4A]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Code Review</h3>
                  <Button
                    variant="outline"
                    className="border-[#2B1F4A] hover:bg-[#2B1F4A] text-[#C2C2DD] hover:text-[#F5F5F5]"
                    onClick={() => setShowOptimalCode(!showOptimalCode)}
                  >
                    {showOptimalCode ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Hide Optimal Solution
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Optimal Solution
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Your Code */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="h-5 w-5 text-[#C2C2DD]" />
                      <h4 className="font-medium">Your Solution</h4>
                    </div>

                    <div className="rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.5rem",
                          background: "#0D0A1A",
                        }}
                      >
                        {battleResults.userCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Optimal Code */}
                  {showOptimalCode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <h4 className="font-medium">Optimal Solution</h4>
                      </div>

                      <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                          language="javascript"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.5rem",
                            background: "#0D0A1A",
                          }}
                        >
                          {battleResults.optimalCode}
                        </SyntaxHighlighter>
                      </div>
                    </motion.div>
                  )}

                  {/* Professor's Feedback */}
                  <div className="bg-[#0D0A1A] rounded-lg p-4 border border-[#2B1F4A]">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-medium">Professor's Feedback</h4>
                    </div>

                    <p className="text-[#C2C2DD]">{battleResults.professorFeedback}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-0">
              <div className="bg-[#18122B] rounded-xl p-6 border border-[#2B1F4A]">
                <h3 className="text-xl font-semibold mb-6">Battle Leaderboard</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2B1F4A]">
                        <th className="px-4 py-3 text-left text-[#C2C2DD]">Rank</th>
                        <th className="px-4 py-3 text-left text-[#C2C2DD]">Player</th>
                        <th className="px-4 py-3 text-left text-[#C2C2DD]">Time</th>
                        <th className="px-4 py-3 text-left text-[#C2C2DD]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {battleResults.competitors.map((competitor, index) => (
                        <tr
                          key={index}
                          className={`border-b border-[#2B1F4A] ${competitor.name === "You" ? "bg-[#2B1F4A]/30" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getPlacementColor(competitor.placement)}`}>
                                {competitor.placement}
                              </span>
                              {competitor.placement <= 3 && (
                                <Trophy className={`h-4 w-4 ${getPlacementColor(competitor.placement)}`} />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={competitor.avatar || "/placeholder.svg"}
                                alt={competitor.name}
                                className="h-8 w-8 rounded-full bg-[#2B1F4A]"
                              />
                              <span className={competitor.name === "You" ? "font-semibold text-white" : ""}>
                                {competitor.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono">{competitor.time}</td>
                          <td className="px-4 py-3">
                            {competitor.placement === 1 ? (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Winner</Badge>
                            ) : competitor.name === "You" ? (
                              <Badge className="bg-[#B689F4]/20 text-[#B689F4] border-[#B689F4]/30">You</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-[#2B1F4A]/50 text-[#C2C2DD] border-[#2B1F4A]">
                                Completed
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer - Action Buttons */}
      <footer className="bg-[#18122B] border-t border-[#2B1F4A] p-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-[#7B3FBF] hover:bg-[#7B3FBF]/80 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              className="border-[#2B1F4A] hover:bg-[#2B1F4A] text-[#C2C2DD] hover:text-[#F5F5F5]"
              onClick={() => {
                setActiveTab("code")
                setShowOptimalCode(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Solution
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-[#2B1F4A] hover:bg-[#2B1F4A] text-[#C2C2DD] hover:text-[#F5F5F5]"
              onClick={() => {
                setActiveTab("leaderboard")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
            <Button
              variant="outline"
              className="border-[#2B1F4A] hover:bg-[#2B1F4A] text-[#C2C2DD] hover:text-[#F5F5F5]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

