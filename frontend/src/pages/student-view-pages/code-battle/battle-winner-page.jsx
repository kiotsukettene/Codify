"use client"

import { useState, useEffect } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WinnerDesign from "@/assets/picture/random-background/WinnerDesign.png"
import { SpaceBackground } from "@/components/student-view/space-animation-bg"

// Format time from seconds to minutes and seconds
const formatTimeDetailed = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`
}

export default function BattleWinnerPage({
  winner,
  winningCondition,
  challengesCompleted,
  totalChallenges = 3,
  totalPoints,
  timeUsed,
  onViewResults,
}) {

  return (
   <SpaceBackground>
      <div className="flex items-center justify-center p-6 w-full min-h-screen">
      <Card className="w-full max-w-lg p-0 overflow-hidden bg-white rounded-2xl shadow-xl border-0">
        {/* Space-themed header image */}
        <div className="w-full h-[220px] overflow-hidden">
          <img src={WinnerDesign || "/placeholder.svg"} alt="Rockets in space" className="w-full h-full object-cover" />
        </div>

        <CardContent className="p-6 text-center space-y-6">
          {/* Winner announcement */}
          <div className="space-y-2 border-b pb-2">
            <h2 className="text-3xl font-bold text-primary">CONGRATULATIONS!</h2>

            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
              <span className="text-purple-600 bg-purple-100 p-2 rounded-sm">Name{winner}</span> is the Winner!
            </h3>
          </div>

          {/* Winning condition */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="text-sm text-purple-700 mb-2 flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" /> Result
            </h4>
            <p className="text-base text-gray-700">{winningCondition}example of Result: Player solved 3/3 challenges faster</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-700 mb-1">Challenges</p>
              <p className="text-lg font-bold text-blue-600">
                {challengesCompleted}/{totalChallenges}
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
              <p className="text-xs text-pink-700 mb-1">Points</p>
              <p className="text-lg font-bold text-pink-600">{totalPoints}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-purple-700 mb-1">Time Used</p>
              <p className="text-lg font-bold font-mono text-purple-600">
                {Math.floor(timeUsed / 60)}:{(timeUsed % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500">Time Used: {formatTimeDetailed(timeUsed)}</div>

          {/* CTA Button */}
          <Button onClick={onViewResults} className="w-full bg-primary text-white py-6 text-lg font-medium">
            View Battle Results <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
   </SpaceBackground>
   
  )
}
