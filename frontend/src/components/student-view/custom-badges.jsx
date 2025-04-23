"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Lock, ChevronRight, Sparkles } from "lucide-react"

// Badge data with cute themes
const cuteBadgesData = [
  {
    id: 1,
    title: "Code Wizard",
    description: "Cast 10 perfect code spells!",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🧙‍♂️",
    unlocked: true,
    rare: true,
    date: "2 days ago",
    color: "bg-purple-100",
    borderColor: "border-purple-300",
    textColor: "text-purple-600",
  },
  {
    id: 2,
    title: "Bug Squasher",
    description: "Squashed 5 tricky bugs",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🐞",
    unlocked: true,
    rare: false,
    date: "1 week ago",
    color: "bg-red-100",
    borderColor: "border-red-300",
    textColor: "text-red-600",
  },
  {
    id: 3,
    title: "Logic Master",
    description: "Solved 20 logic puzzles",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🧩",
    unlocked: true,
    rare: false,
    date: "2 weeks ago",
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-600",
  },
  {
    id: 4,
    title: "Team Buddy",
    description: "Helped 3 teammates succeed",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🤝",
    unlocked: true,
    rare: false,
    date: "3 weeks ago",
    color: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-600",
  },
  {
    id: 5,
    title: "Code Ninja",
    description: "Mastered the art of silent coding",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🥷",
    unlocked: false,
    rare: true,
    unlocksAt: "Level 20",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
  },
  {
    id: 6,
    title: "Data Wizard",
    description: "Organized 3 complex databases",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "📊",
    unlocked: false,
    rare: false,
    unlocksAt: "Complete Database Course",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
  },
  {
    id: 7,
    title: "Design Unicorn",
    description: "Created 10 magical interfaces",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "🦄",
    unlocked: false,
    rare: false,
    unlocksAt: "10 UI Projects",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
  },
  {
    id: 8,
    title: "Battle Hero",
    description: "Won 50 epic coding battles",
    image: "/placeholder.svg?height=80&width=80",
    emoji: "⚔️",
    unlocked: false,
    rare: true,
    unlocksAt: "50 Wins",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
  },
]

const CustomBadge = ({ badge }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${badge.color} border-2 ${badge.borderColor} shadow-md transition-all duration-300`}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        rotate: badge.unlocked ? [0, -1, 1, 0] : 0,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ transform: "rotate(-1deg)" }}
    >
      {/* Rare badge indicator */}
      {badge.rare && badge.unlocked && (
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </div>
      )}

      {/* Badge content */}
      <div className="p-5 flex flex-col items-center">
        <div className="relative mb-3">
          {/* Badge image with emoji overlay */}
          <div
            className={`relative rounded-full p-2 ${
              badge.unlocked ? "bg-white" : "bg-gray-200"
            } border-2 ${badge.borderColor}`}
          >
            <div className={`rounded-full overflow-hidden ${!badge.unlocked && "opacity-40"} relative`}>
              <img src={badge.image || "/placeholder.svg"} alt={badge.title} className="w-16 h-16 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">{badge.emoji}</div>
            </div>

            {/* Sparkle effect for rare badges */}
            {badge.rare && badge.unlocked && isHovered && (
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
                <div className="absolute -bottom-1 -left-1">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
              </motion.div>
            )}

            {/* Lock overlay for locked badges */}
            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30">
                <Lock className="h-6 w-6 text-white opacity-80" />
              </div>
            )}
          </div>
        </div>

        {/* Badge title */}
        <h3 className={`text-lg font-bold mb-1 ${badge.unlocked ? badge.textColor : "text-gray-500"}`}>
          {badge.title}
        </h3>

        {/* Badge description or unlock requirement */}
        <p className={`text-sm text-center ${badge.unlocked ? "text-gray-600" : "text-gray-500"}`}>
          {badge.unlocked ? badge.description : `Unlocks at: ${badge.unlocksAt}`}
        </p>

        {/* Earned date for unlocked badges */}
        {badge.unlocked && <p className="mt-2 text-xs text-gray-500">Earned {badge.date}</p>}
      </div>

      {/* Glowing effect for rare badges */}
      {badge.rare && badge.unlocked && (
        <motion.div
          className="absolute inset-0 -z-10 opacity-0 bg-yellow-200 rounded-xl blur-md"
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

const CuteBadges = () => {
  // Calculate progress
  const unlockedCount = cuteBadgesData.filter((badge) => badge.unlocked).length
  const totalCount = cuteBadgesData.length
  const progressPercentage = (unlockedCount / totalCount) * 100

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 inline-block relative font-nunito"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Achievements 🎖️
            <motion.div
              className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-yellow-300 via-purple-400 to-pink-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6 font-nunito">
            Unlock more badges as you win battles and level up!
          </p>

          {/* Progress bar with cute styling */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm mb-1 font-nunito">
              <span className="font-medium">Your Collection</span>
              <span>
                {unlockedCount}/{totalCount} Badges
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* Animated character on progress bar */}
                {progressPercentage > 10 && (
                  <motion.div
                    className="absolute right-0 -top-1 text-lg"
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🚀
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cuteBadgesData.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CuteBadge badge={badge} />
            </motion.div>
          ))}
        </div>

        {/* View all button with cute styling */}
        <div className="mt-12 text-center">
          <motion.button
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all font-nunito"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Achievements
            <ChevronRight className="ml-2 h-5 w-5" />
            <motion.span
              className="absolute -top-1 -right-1 text-lg"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              ✨
            </motion.span>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default CustomBadges

