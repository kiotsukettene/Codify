"use client"

import { useState } from "react"
import { Trophy, Clock, CheckCircle, XCircle, ArrowLeft, FileText, Home, User, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"


// Sample data for the battle results
const sampleBattleResults = {
  battleId: "battle-123",
  battleTitle: "Algorithmic Coding Battle",
  timeLimit: 3600, // 1 hour in seconds
  timeUsed: 2145, // 35:45 in seconds
  hasWinner: true,
  winningCondition: "Finished all 3 challenges first",
  players: [
    {
      id: "user123",
      name: "Player1",
      isWinner: true,
      completedChallenges: [1, 2, 3],
      totalScore: 580,
      timeSpent: 2145, // in seconds
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 4, totalTests: 4, score: 150, timeSpent: 720 },
        { id: 2, title: "Challenge 2", passedTests: 4, totalTests: 4, score: 180, timeSpent: 825 },
        { id: 3, title: "Challenge 3", passedTests: 4, totalTests: 4, score: 250, timeSpent: 600 },
      ],
    },
    {
      id: "opponent1",
      name: "CodeNinja",
      isWinner: false,
      completedChallenges: [1, 2],
      totalScore: 330,
      timeSpent: 2145, // in seconds
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 4, totalTests: 4, score: 150, timeSpent: 780 },
        { id: 2, title: "Challenge 2", passedTests: 4, totalTests: 4, score: 180, timeSpent: 1050 },
        { id: 3, title: "Challenge 3", passedTests: 0, totalTests: 4, score: 0, timeSpent: 315 },
      ],
    },
  ],
}

// Alternative scenario: No winner
const noWinnerResults = {
  ...sampleBattleResults,
  hasWinner: false,
  winningCondition: "No challenges completed before time expired",
  players: [
    {
      ...sampleBattleResults.players[0],
      isWinner: false,
      completedChallenges: [],
      totalScore: 0,
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 2, totalTests: 4, score: 0, timeSpent: 1800 },
        { id: 2, title: "Challenge 2", passedTests: 0, totalTests: 4, score: 0, timeSpent: 0 },
        { id: 3, title: "Challenge 3", passedTests: 0, totalTests: 4, score: 0, timeSpent: 0 },
      ],
    },
    {
      ...sampleBattleResults.players[1],
      isWinner: false,
      completedChallenges: [],
      totalScore: 0,
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 1, totalTests: 4, score: 0, timeSpent: 1800 },
        { id: 2, title: "Challenge 2", passedTests: 0, totalTests: 4, score: 0, timeSpent: 0 },
        { id: 3, title: "Challenge 3", passedTests: 0, totalTests: 4, score: 0, timeSpent: 0 },
      ],
    },
  ],
}

// Alternative scenario: Winner by points
const pointsWinnerResults = {
  ...sampleBattleResults,
  winningCondition: "Highest score when time expired",
  players: [
    {
      ...sampleBattleResults.players[0],
      completedChallenges: [1, 2],
      totalScore: 330,
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 4, totalTests: 4, score: 150, timeSpent: 720 },
        { id: 2, title: "Challenge 2", passedTests: 4, totalTests: 4, score: 180, timeSpent: 825 },
        { id: 3, title: "Challenge 3", passedTests: 2, totalTests: 4, score: 0, timeSpent: 600 },
      ],
    },
    {
      ...sampleBattleResults.players[1],
      isWinner: false,
      completedChallenges: [1],
      totalScore: 150,
      challengeResults: [
        { id: 1, title: "Challenge 1", passedTests: 4, totalTests: 4, score: 150, timeSpent: 780 },
        { id: 2, title: "Challenge 2", passedTests: 2, totalTests: 4, score: 0, timeSpent: 1050 },
        { id: 3, title: "Challenge 3", passedTests: 0, totalTests: 4, score: 0, timeSpent: 315 },
      ],
    },
  ],
}

// Format time from seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function BattleResults({ scenario = "winner" }) {
  const navigate = useNavigate()

  const [battleResults, setBattleResults] = useState(
    scenario === "no-winner"
      ? noWinnerResults
      : scenario === "points-winner"
        ? pointsWinnerResults
        : sampleBattleResults,
  )

  // Find the winner (if any)
  const winner = battleResults.players.find((player) => player.isWinner)

  return (
    
    <div className="flex flex-col min-h-screen bg-[#0D0A1A] text-[#F5F5F5]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#18122B] border-b border-[#2B1F4A] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-1 h-8 w-8 hover:bg-[#2B1F4A] rounded-full text-[#C2C2DD] hover:text-[#F5F5F5]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-bold flex items-center gap-1 truncate">
            <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <span className="truncate">{battleResults.battleTitle}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#231b3d] border border-[#2B1F4A] px-3 py-1 rounded text-sm flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#E94560]" />
            <span className="font-mono text-sm">{formatTime(battleResults.timeUsed)}</span>
          </div>
          <div className="bg-[#231b3d] border border-[#2B1F4A] px-3 py-1 rounded text-sm flex items-center gap-1">
            <Users className="h-3 w-3 text-[#C2C2DD]" />
            <span className="text-sm">{battleResults.players.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto py-6 px-4">
        {/* Battle Results Banner */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#B689F4]">🏆 BATTLE RESULTS</h1>
            <p className="text-[#C2C2DD]">See how you performed in this coding battle</p>
          </div>

          <Card
            className={`border ${battleResults.hasWinner ? "border-yellow-500/50" : "border-[#2B1F4A]"} bg-[#18122B] shadow-lg`}
          >
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex justify-center items-center gap-2">
                {battleResults.hasWinner ? (
                  <>
                    <Trophy className="h-6 w-6 text-yellow-400" />
                    <span className="text-yellow-400">Winner: {winner?.name}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-[#E94560]" />
                    <span className="text-[#E94560]">No Winner</span>
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-[#C2C2DD] text-base">{battleResults.winningCondition}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#C2C2DD]" />
                <span className="text-neutral-50">Time Used: {formatTime(battleResults.timeUsed)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Stats Comparison */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#B689F4]" />
          Player Stats
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {battleResults.players.map((player) => (
            <Card
              key={player.id}
              className={`border ${
                player.isWinner
                  ? "border-yellow-500 bg-gradient-to-b from-[#18122B] to-[#231b3d] shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                  : "border-[#2B1F4A] bg-[#18122B]"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`relative rounded-full overflow-hidden border-2 ${
                      player.isWinner ? "border-yellow-400" : "border-[#2B1F4A]"
                    }`}
                  >
                  
                    {player.isWinner && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                        <Trophy className="h-3 w-3 text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-neutral-50">
                      {player.name}
                      {player.isWinner && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500 text-xs">Winner</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-[#C2C2DD]">
                      {player.completedChallenges.length} / 3 challenges completed
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#0D0A1A] rounded-lg p-2">
                    <p className="text-xs text-[#C2C2DD]">Score</p>
                    <p className="text-lg font-bold text-yellow-400">{player.totalScore}</p>
                  </div>
                  <div className="bg-[#0D0A1A] rounded-lg p-2">
                    <p className="text-xs text-[#C2C2DD]">Completed</p>
                    <p className="text-lg font-bold text-green-400">{player.completedChallenges.length}</p>
                  </div>
                  <div className="bg-[#0D0A1A] rounded-lg p-2">
                    <p className="text-xs text-[#C2C2DD]">Time</p>
                    <p className="text-lg font-bold font-mono  text-neutral-50">{formatTime(player.timeSpent)}</p>
                  </div>
                </div>

                <div className="space-y-3 text-neutral-50">
                  <h4 className="text-sm font-medium text-neutral-50">Challenge Progress</h4>
                  {player.challengeResults.map((challenge) => (
                    <div key={challenge.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          {challenge.passedTests === challenge.totalTests ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-[#2B1F4A]" />
                          )}
                          <span>{challenge.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#C2C2DD]">
                            {challenge.passedTests}/{challenge.totalTests}
                          </span>
                          {challenge.score > 0 && <span className="text-yellow-400">+{challenge.score}</span>}
                        </div>
                      </div>
                      <Progress
                        value={(challenge.passedTests / challenge.totalTests) * 100}
                        className="h-1.5 bg-[#0D0A1A]"
                        indicatorClassName={`${
                          challenge.passedTests === challenge.totalTests
                            ? "bg-green-500"
                            : challenge.passedTests > 0
                              ? "bg-yellow-500"
                              : "bg-[#2B1F4A]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Challenge Breakdown */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#B689F4]" />
          Challenge Breakdown
        </h2>

        <Card className="border border-[#2B1F4A] bg-[#18122B] mb-8 text-neutral-50">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[1, 2, 3].map((challengeId) => (
                <div key={challengeId}>
                  <h3 className="text-lg font-medium mb-3">Challenge {challengeId}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {battleResults.players.map((player) => {
                      const challenge = player.challengeResults.find((c) => c.id === challengeId)
                      const isCompleted = challenge?.passedTests === challenge?.totalTests

                      return (
                        <div
                          key={`${player.id}-${challengeId}`}
                          className={`p-3 rounded-lg border ${
                            isCompleted ? "border-green-500/30 bg-green-500/10" : "border-[#2B1F4A] bg-[#0D0A1A]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-[#231b3d] flex items-center justify-center">
                                <User className="h-3 w-3" />
                              </div>
                              <span className="font-medium">{player.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isCompleted ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                                </Badge>
                              ) : challenge?.passedTests > 0 ? (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">Partial</Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500">
                                  <XCircle className="h-3 w-3 mr-1" /> Not Completed
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-[#18122B] rounded p-1">
                              <p className="text-[#C2C2DD]">Tests</p>
                              <p className="font-medium">
                                {challenge?.passedTests || 0}/{challenge?.totalTests || 0}
                              </p>
                            </div>
                            <div className="bg-[#18122B] rounded p-1">
                              <p className="text-[#C2C2DD]">Score</p>
                              <p className="font-medium text-yellow-400">{challenge?.score || 0}</p>
                            </div>
                            <div className="bg-[#18122B] rounded p-1">
                              <p className="text-[#C2C2DD]">Time</p>
                              <p className="font-medium font-mono">{formatTime(challenge?.timeSpent || 0)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {challengeId < 3 && <Separator className="mt-4 bg-[#2B1F4A]" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          
          <Button onClick={()=> navigate('/student/code-battle')} variant="outline" className="border-[#2B1F4A]  text-neutral-900 hover:bg-[#2B1F4A] hover:text-white">
            <Home className="h-4 w-4 mr-2" /> Return to Dashboard
          </Button>
        </div>

      </main>

      <footer className="py-4 px-6 text-center border-t border-[#2B1F4A] text-[#C2C2DD] text-sm">
        <p>&copy; {new Date().getFullYear()} Codify. All rights reserved.</p>
      </footer>
    </div>
  )
}
