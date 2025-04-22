"use client"

import { XCircle, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Format time from seconds to minutes and seconds
const formatTimeDetailed = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`
}

export default function NoWinnerModal({
  isOpen,
  onClose,
  reason = "Neither player solved any challenges before time ran out.",
  timeUsed,
  onViewResults,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#18122B] border-2 border-[#2B1F4A] text-[#F5F5F5] max-w-md shadow-lg p-0 overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-[#2B1F4A] to-[#18122B] py-3 px-6 text-center">
          <h2 className="text-2xl font-bold text-[#C2C2DD]">⏱️ Time's Up!</h2>
        </div>

        <div className="p-6 text-center space-y-6">
          {/* No winner announcement */}
          <div className="space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-[#2B1F4A]/20 border-2 border-[#2B1F4A] flex items-center justify-center">
                <XCircle className="h-10 w-10 text-[#E94560]" />
              </div>
            </div>

            <h3 className="text-xl font-bold">😐 No Winner This Time</h3>
          </div>

          {/* Reason */}
          <div className="bg-[#231b3d] rounded-lg p-4 border border-[#2B1F4A]">
            <h4 className="text-sm text-[#C2C2DD] mb-2 flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4 text-[#E94560]" /> Reason
            </h4>
            <p className="text-base">{reason}</p>
          </div>

          {/* Time used */}
          <div className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A] mx-auto max-w-[200px]">
            <p className="text-xs text-[#C2C2DD] mb-1">Time Used</p>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-[#C2C2DD]" />
              <p className="text-lg font-bold font-mono">
                {Math.floor(timeUsed / 60)}:{(timeUsed % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="text-sm text-[#C2C2DD]">Battle Duration: {formatTimeDetailed(timeUsed)}</div>

          {/* Message */}
          <p className="text-[#C2C2DD]">Better luck next time! Review the battle results to see how you performed.</p>

          {/* CTA Button */}
          <Button
            onClick={onViewResults}
            className="w-full bg-[#2B1F4A] hover:bg-[#3B2F5A] text-white py-6 text-lg font-bold"
          >
            View Battle Results <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
