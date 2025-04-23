"use client"

import { useState, useEffect } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LostBG from "@/assets/picture/random-background/LostBG.png"

// Format time from seconds to minutes and seconds
const formatTimeDetailed = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`
}

export default function BattleLostPage({
  winner,
  winningCondition,
  challengesCompleted,
  totalChallenges = 3,
  totalPoints,
  timeUsed,
  onViewResults,
  playerName = "Player",
}) {


   

  return (
    <div className="flex items-center justify-center p-6 w-full min-h-screen bg-gradient-to-b from-[#18122B] to-[#0D0A1A]">
     <Card className="w-full max-w-lg p-0 overflow-hidden bg-gray-900 rounded-2xl shadow-xl border-0">
  {/* Header Image */}
  <div className="w-full h-[220px] overflow-hidden">
    <img src={LostBG || "/defeated-astronaut.svg"} alt="You Lost" className="w-full h-full object-cover" />
  </div>

  <CardContent className="p-6 text-center space-y-6">
    {/* Loss message */}
    <div className="space-y-2 border-b pb-2">
      <h2 className="text-3xl font-bold text-white">Game Over</h2>
      <h3 className="text-lg font-medium text-neutral-200">You gave it your best, <span className="text-purple-300">{playerName}</span>!</h3>
    </div>

    {/* Encouragement */}
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <p className="text-base text-gray-700">
        The winner finished faster or scored higher. But you’re one challenge away from turning it around next time!
      </p>
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

    {/* CTA */}
    <Button onClick={onViewResults} className="w-full bg-gray-600 text-white py-6 text-md font-medium hover:bg-gray-700">
      View Full Battle Stats
    </Button>
  </CardContent>
</Card>

    </div>
  )
}
