"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, CheckCircle, XCircle, ArrowLeft, FileText, Home, User, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import axios from "axios"
import { useStudentStore } from "@/store/studentStore"
import LoadingSpinner from "@/components/LoadingSpinner"

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

// Format time from seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function BattleResults() {
  const navigate = useNavigate()
  const { battleCode } = useParams()
  const { student } = useStudentStore()
  const [isLoading, setIsLoading] = useState(true)
  const [battleResults, setBattleResults] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBattleResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/${battleCode}`, {
          withCredentials: true
        });

        const battleData = response.data;
        
        // Format the battle results
        const formattedResults = {
          battleId: battleData.battleCode,
          battleTitle: battleData.title,
          timeLimit: battleData.duration * 60, // convert minutes to seconds
          timeUsed: battleData.duration * 60, // This should be actual time used from the battle
          hasWinner: true, // This will be determined by challenge completion
          winningCondition: "Completed most challenges",
          players: [
            {
              id: battleData.player1.id,
              name: `${battleData.player1.name}`,
              isWinner: false, // Will be set below
              completedChallenges: [],
              totalScore: 0,
              timeSpent: 0,
              challengeResults: battleData.challenges.map((challenge, index) => {
                const progress = challenge.playerProgress?.find(p => p.playerId === battleData.player1.id);
                const isCompleted = progress?.status === "completed";
                return {
                  id: index + 1,
                  title: challenge.problemTitle,
                  passedTests: isCompleted ? 3 : 0, // Set to 3 if completed
                  totalTests: 3, // Always 3 test cases
                  score: isCompleted ? challenge.points : 0,
                  timeSpent: progress?.timeSpent || 0
                };
              })
            },
            {
              id: battleData.player2.id,
              name: `${battleData.player2.name}`,
              isWinner: false,
              completedChallenges: [],
              totalScore: 0,
              timeSpent: 0,
              challengeResults: battleData.challenges.map((challenge, index) => {
                const progress = challenge.playerProgress?.find(p => p.playerId === battleData.player2.id);
                const isCompleted = progress?.status === "completed";
                return {
                  id: index + 1,
                  title: challenge.problemTitle,
                  passedTests: isCompleted ? 3 : 0, // Set to 3 if completed
                  totalTests: 3, // Always 3 test cases
                  score: isCompleted ? challenge.points : 0,
                  timeSpent: progress?.timeSpent || 0
                };
              })
            }
          ]
        };

        // Calculate completed challenges and total scores
        formattedResults.players.forEach(player => {
          player.completedChallenges = player.challengeResults
            .filter(c => c.passedTests === c.totalTests)
            .map(c => c.id);
          player.totalScore = player.challengeResults.reduce((sum, c) => sum + c.score, 0);
          player.timeSpent = player.challengeResults.reduce((sum, c) => sum + c.timeSpent, 0);
        });

        // Determine winner
        const [player1, player2] = formattedResults.players;
        if (player1.completedChallenges.length > player2.completedChallenges.length) {
          player1.isWinner = true;
          formattedResults.winningCondition = "Completed more challenges";
        } else if (player2.completedChallenges.length > player1.completedChallenges.length) {
          player2.isWinner = true;
          formattedResults.winningCondition = "Completed more challenges";
        } else if (player1.totalScore > player2.totalScore) {
          player1.isWinner = true;
          formattedResults.winningCondition = "Higher total score";
        } else if (player2.totalScore > player1.totalScore) {
          player2.isWinner = true;
          formattedResults.winningCondition = "Higher total score";
        } else if (player1.timeSpent < player2.timeSpent) {
          player1.isWinner = true;
          formattedResults.winningCondition = "Faster completion time";
        } else if (player2.timeSpent < player1.timeSpent) {
          player2.isWinner = true;
          formattedResults.winningCondition = "Faster completion time";
        } else {
          formattedResults.hasWinner = false;
          formattedResults.winningCondition = "Battle ended in a tie";
        }

        setBattleResults(formattedResults);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching battle results:", error);
        setError(error.response?.data?.message || "Failed to load battle results");
        setIsLoading(false);
      }
    };

    if (battleCode) {
      fetchBattleResults();
    }
  }, [battleCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !battleResults) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to Load Results</h2>
          <p className="text-gray-400 mb-4">{error || "Battle results not found"}</p>
          <Button onClick={() => navigate('/student/code-battle')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate('/student/code-battle')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-bold flex items-center gap-1 truncate">
            <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <span className="truncate">{battleResults.battleTitle}</span>
          </h1>
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
                          {challenge.score > 0 && (
                            <>
                              <span className="text-yellow-400">+{challenge.score}</span>
                              <span className="text-[#C2C2DD] font-mono">({formatTime(challenge.timeSpent)})</span>
                            </>
                          )}
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