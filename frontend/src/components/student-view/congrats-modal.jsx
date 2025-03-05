import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, Star } from 'lucide-react'
import confetti from 'canvas-confetti'

function CongratulationsModal({ isOpen, onClose, onNavigate }) {
  if (isOpen) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6"
        >
          {/* Trophy Icon */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-500" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-yellow-200 -z-10"
              />
            </div>
          </motion.div>

          {/* Title with Sparkles */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            You've successfully completed the module! 🎉
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Star className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-sm text-purple-700">Module Completed</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-sm text-blue-700">Learning Goal Achieved!</p>
            </div>
          </div>

          {/* Continue Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onNavigate}
              className="bg-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Continue Learning
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default CongratulationsModal
