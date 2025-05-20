"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Lock, Sparkles, MedalIcon } from "lucide-react"

// Import badge images from mock data
import { getBadgeById } from "@/pages/student-view-pages/code-battle/badges-mock-data"
import AchievementsModal from "./achievements-modal"

const battleBadgesData = [
  {
    id: 1,
    title: "Code Wizard",
    description: "Cast 10 perfect code spells!",
    image: getBadgeById("syntax-master").image,
    unlocked: true,
    rare: true,
    date: "2 days ago",
    color: "bg-purple-100",
    borderColor: "border-purple-300",
    textColor: "text-purple-600",
    bgColor: "#EDE9FE", // Light purple
    iconColor: "#8B5CF6", // Purple
  },
  {
    id: 2,
    title: "Bug Squasher",
    description: "Squashed 5 tricky bugs",
    image: getBadgeById("debugger-extraordinaire").image,
    unlocked: true,
    rare: false,
    date: "1 week ago",
    color: "bg-red-100",
    borderColor: "border-red-300",
    textColor: "text-red-600",
    bgColor: "#FEE2E2", // Light red
    iconColor: "#EF4444", // Red
  },
  {
    id: 3,
    title: "Logic Master",
    description: "Solved 20 logic puzzles",
    image: getBadgeById("algorithm-ace").image,
    unlocked: true,
    rare: false,
    date: "2 weeks ago",
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-600",
    bgColor: "#DBEAFE", // Light blue
    iconColor: "#3B82F6", // Blue
  },
  {
    id: 4,
    title: "Team Buddy",
    description: "Helped 3 teammates succeed",
    image: getBadgeById("battle-veteran").image,
    rare: false,
    date: "3 weeks ago",
    color: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-600",
    bgColor: "#DCFCE7", // Light green
    iconColor: "#22C55E", // Green
  },
  {
    id: 5,
    title: "Code Ninja",
    description: "Mastered the art of silent coding",
    image: getBadgeById("speed-coder").image,
    unlocked: false,
    rare: true,
    unlocksAt: "Level 20",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
    bgColor: "#F3F4F6", // Light gray
    iconColor: "#6B7280", // Gray
  },
  {
    id: 6,
    title: "Data Wizard",
    description: "Organized 3 complex databases",
    image: getBadgeById("optimization-wizard").image,
    unlocked: false,
    rare: false,
    unlocksAt: "Complete Database Course",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
    bgColor: "#F3F4F6", // Light gray
    iconColor: "#6B7280", // Gray
  },
  {
    id: 7,
    title: "Design Unicorn",
    description: "Created 10 magical interfaces",
    image: getBadgeById("creative-coder").image,
    unlocked: false,
    rare: false,
    unlocksAt: "10 UI Projects",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
    bgColor: "#F3F4F6", // Light gray
    iconColor: "#6B7280", // Gray
  },
  {
    id: 8,
    title: "Battle Hero",
    description: "Won 50 epic coding battles",
    image: getBadgeById("legendary-coder").image,
    unlocked: false,
    rare: true,
    unlocksAt: "50 Wins",
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
    bgColor: "#F3F4F6", // Light gray
    iconColor: "#6B7280", // Gray
  },
]

const BattleBadge = ({ badge }) => {
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
          {/* Badge image */}
          <div
            className={`relative rounded-full p-2 ${
              badge.unlocked ? "bg-white" : "bg-gray-200"
            } border-2 ${badge.borderColor}`}
          >
            <div className="rounded-full overflow-hidden relative w-16 h-16">
              <img src={badge.image || "/placeholder.svg"} alt={badge.title} className="w-full h-full object-cover" />
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

const AchievementBadges = () => {
  const [showModal, setShowModal] = useState(false)

  // Calculate progress
  const unlockedCount = battleBadgesData.filter((badge) => badge.unlocked).length
  const totalCount = battleBadgesData.length
  const progressPercentage = (unlockedCount / totalCount) * 100

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl text-header font-bold mb-3 inline-block relative font-nunito bg-purple-100 rounded-lg px-4 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-2 gap-2">
              Your Achievements <MedalIcon className="w-12 h-12 text-primary" />
            </div>
            <motion.div
              className="absolute -bottom-2 left-0 h-1.5 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6 font-nunito">
            Unlock more badges as you win battles and level up!
          </p>

          {/* Progress bar with battle styling */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm mb-1 font-nunito">
              <span className="font-medium">Your Collection</span>
              <span>
                {unlockedCount}/{totalCount} Badges
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <motion.div
                className="h-full bg-purple-400 rounded-full relative"
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
                  ></motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {battleBadgesData.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BattleBadge badge={badge} />
            </motion.div>
          ))}
        </div>

        {/* View all button with battle styling */}
        <div className="mt-12 text-center">
          <motion.button
            className="inline-flex items-center px-8 py-3 bg-primary text-white hover:bg-opacity-50 rounded-full font-medium shadow-md hover:shadow-lg transition-all font-nunito relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
          >
            View All Achievements
          </motion.button>
        </div>
      </div>

      {/* Achievements Modal */}
      <AchievementsModal open={showModal} onOpenChange={setShowModal} />
    </section>
  )
}

export default AchievementBadges