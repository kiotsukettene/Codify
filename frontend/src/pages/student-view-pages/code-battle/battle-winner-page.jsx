"use client"

import { useState, useEffect } from "react"
import { CheckCircle, ArrowRight, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WinnerDesign from "@/assets/picture/random-background/winnerDesign.png"
import { SpaceBackground } from "@/components/student-view/space-animation-bg"
import BadgeModal from "./badge-modal"
import { getBadgeByPoints } from "./badges-mock-data"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useStudentStore } from "@/store/studentStore"

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

// Format time from seconds to minutes and seconds
const formatTimeDetailed = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`
}

export default function BattleWinnerPage() {
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [battleData, setBattleData] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { battleCode } = useParams()
  const { student } = useStudentStore()

  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${battleCode}`, {
          withCredentials: true
        });

        const data = response.data;
        
        // Calculate total points and completed challenges
        const playerProgress = data.challenges.reduce((acc, challenge) => {
          const progress = challenge.playerProgress?.find(p => p.playerId === student._id);
          if (progress?.status === "completed") {
            acc.totalPoints += challenge.points;
            acc.completedChallenges++;
            acc.timeUsed += progress.timeSpent || 0;
          }
          return acc;
        }, { totalPoints: 0, completedChallenges: 0, timeUsed: 0 });

        setBattleData({
          winner: `${student.firstName} ${student.lastName}`,
          winningCondition: "Completed all challenges first!",
          ...playerProgress,
          totalChallenges: data.challenges.length
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching battle data:", error);
        setError(error.response?.data?.message || "Failed to load battle data");
        setIsLoading(false);
      }
    };

    if (battleCode) {
      fetchBattleData();
    }
  }, [battleCode, student]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !battleData) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Failed to Load Results</h2>
          <p className="text-gray-400 mb-4">{error || "Battle data not found"}</p>
          <Button onClick={() => navigate('/student/code-battle')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // badge to show based on points
  const earnedBadge = getBadgeByPoints(battleData.totalPoints)

  const handleViewResults = () => {
    navigate(`/student/code-battle/results/${battleCode}`)
  }

  return (
    <SpaceBackground>
      <div className="flex items-center justify-center p-6 w-full min-h-screen">
        <Card className="w-full max-w-lg p-0 overflow-hidden bg-white rounded-2xl shadow-xl border-0">
          {/* Space-themed header image */}
          <div className="w-full h-[220px] overflow-hidden">
            <img
              src={WinnerDesign || "/placeholder.svg"}
              alt="Rockets in space"
              className="w-full h-full object-cover"
            />
          </div>

          <CardContent className="p-6 text-center space-y-6">
            {/* Winner announcement */}
            <div className="space-y-2 border-b pb-2">
              <h2 className="text-3xl font-bold text-primary">CONGRATULATIONS!</h2>
              <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                <span className="text-purple-600 bg-purple-100 p-2 rounded-sm">{battleData.winner}</span> is the Winner!
              </h3>
            </div>

            {/* Winning condition */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm text-purple-700 mb-2 flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" /> Result
              </h4>
              <p className="text-base text-gray-700">{battleData.winningCondition}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 mb-1">Challenges</p>
                <p className="text-lg font-bold text-blue-600">
                  {battleData.completedChallenges}/{battleData.totalChallenges}
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                <p className="text-xs text-pink-700 mb-1">Points</p>
                <p className="text-lg font-bold text-pink-600">{battleData.totalPoints}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs text-purple-700 mb-1">Time Used</p>
                <p className="text-lg font-bold font-mono text-purple-600">
                  {Math.floor(battleData.timeUsed / 60)}:{(battleData.timeUsed % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500">Time Used: {formatTimeDetailed(battleData.timeUsed)}</div>

            {/* Badge Button */}
            <Button
              onClick={() => setShowBadgeModal(true)}
              className="w-full py-5 text-lg font-medium mb-3 text-white"
              style={{
                background: `linear-gradient(to right, ${earnedBadge.color}, ${earnedBadge.color}dd)`,
              }}
            >
              <Award className="h-5 w-5 mr-2" /> Reveal My Badge
            </Button>

            {/* CTA Button */}
            <Button onClick={handleViewResults} className="w-full bg-primary text-white py-6 text-lg font-medium">
              View Battle Results <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Badge Modal Component */}
      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        badgeId={earnedBadge.id}
        onViewAllBadges={() => console.log("View all badges clicked")}
      />
    </SpaceBackground>
  )
}
