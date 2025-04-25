"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Star, Lock, Search, X, ChevronLeft, ChevronRight, MedalIcon, Trophy, BadgeCheck } from "lucide-react"

// Import all badges from mock data
import { getAllBadges } from "@/pages/student-view-pages/code-battle/badges-mock-data"

// Badge categories for filtering
const categories = [
  { id: "all", name: "All Badges" },
  { id: "common", name: "Common" },
  { id: "uncommon", name: "Uncommon" },
  { id: "rare", name: "Rare" },
  { id: "epic", name: "Epic" },
  { id: "legendary", name: "Legendary" },
]

export default function AchievementsModal({ open, onOpenChange }) {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const badgesPerPage = 8

  // Get all badges from mock data
  const allBadges = getAllBadges()

  // Convert to the format used in battleBadgesData
  const formattedBadges = allBadges.map((badge) => ({
    id: badge.id,
    title: badge.name,
    description: badge.description,
    image: badge.image,
    unlocked: Math.random() > 0.4, // Randomly set some as unlocked for demo
    rare: ["rare", "epic", "legendary"].includes(badge.rarity),
    date: "2 weeks ago",
    color: `bg-${getBadgeColorClass(badge.color)}`,
    borderColor: `border-${getBadgeColorClass(badge.color)}`,
    textColor: `text-${getBadgeColorClass(badge.color)}`,
    bgColor: badge.color,
    iconColor: badge.color,
    rarity: badge.rarity,
    requiredPoints: badge.requiredPoints,
  }))

  // Filter badges by category and search query
  const filteredBadges = formattedBadges
    .filter((badge) => activeCategory === "all" || badge.rarity === activeCategory)
    .filter(
      (badge) =>
        badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  // Calculate total pages
  const totalPages = Math.ceil(filteredBadges.length / badgesPerPage)

  // Get current page badges
  const currentBadges = filteredBadges.slice(currentPage * badgesPerPage, (currentPage + 1) * badgesPerPage)

  // Calculate progress
  const unlockedCount = formattedBadges.filter((badge) => badge.unlocked).length
  const totalCount = formattedBadges.length
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100)

  // Handle badge click
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge)
    if (badge.unlocked) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Reset selected badge when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedBadge(null)
      setShowConfetti(false)
      setCurrentPage(0)
      setSearchQuery("")
      setActiveCategory("all")
    }
  }, [open])

  function getBadgeColorClass(hexColor) {
    
    const colorMap = {
      "#FFA500": "orange-500",
      "#8A2BE2": "purple-600",
      "#B22222": "red-700",
      "#1F7D53": "green-700",
      "#A5158C": "pink-700",
      "#EC7FA9": "pink-400",
      "#7886C7": "indigo-400",
      "#644A07": "yellow-900",
      "#9B3922": "red-800",
      "#A62C2A": "red-700",
      "#526D82": "slate-600",
      "#7A1CAC": "purple-800",
      "#FE6E00": "orange-600",
      "#161179": "indigo-900",
      "#E53888": "pink-600",
    }

    return colorMap[hexColor] || "gray-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && <Confetti />}

        {/* Header */}
        <div className="relative p-6 pb-2 border-b">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-header">
              <MedalIcon className="h-6 w-6 text-primary" />
              Achievement Collection
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {unlockedCount} of {totalCount} badges unlocked
              </span>
              <Progress
                value={progressPercentage}
                className="w-32 h-2 bg-gray-200 dark:bg-gray-700"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
              />
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{unlockedCount * 50} XP</span>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-100 dark:bg-gray-800 border-none"
              />
            </div>
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger value="all" className="text-xs px-3">
                  All
                </TabsTrigger>
                <TabsTrigger value="legendary" className="text-xs px-3">
                  <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                  Legendary
                </TabsTrigger>
                <TabsTrigger value="rare" className="text-xs px-3">
                  Rare
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="p-6 pt-4 grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto">
          {/* Selected badge detail */}
          {selectedBadge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex gap-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                <div
                  className={`w-24 h-24 ${selectedBadge.color} rounded-xl flex items-center justify-center border-2 ${selectedBadge.borderColor}`}
                >
                  <img
                    src={selectedBadge.image || "/placeholder.svg"}
                    alt={selectedBadge.title}
                    className="w-20 h-20 object-contain"
                  />

                  {/* Sparkle effect for rare badges */}
                  {selectedBadge.rare && selectedBadge.unlocked && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(255,215,0,0.3)",
                          "0 0 20px rgba(255,215,0,0.5)",
                          "0 0 10px rgba(255,215,0,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}

                  {/* Lock overlay for locked badges */}
                  {!selectedBadge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-30">
                      <Lock className="h-10 w-10 text-white opacity-80" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{selectedBadge.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedBadge.description}</p>
                  </div>
                  <div
                    className={`uppercase px-2 py-1 rounded-full text-xs font-medium ${getRarityClasses(selectedBadge.rarity)}`}
                  >
                    {selectedBadge.rarity}
                  </div>
                </div>

                <div className="mt-4">
                  {selectedBadge.unlocked ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <BadgeCheck className="h-4 w-4" />
                      <span>Earned {selectedBadge.date}</span>
                      <span className="ml-auto text-primary">+{selectedBadge.requiredPoints} XP</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Required Points</span>
                        <span>{selectedBadge.requiredPoints} XP</span>
                      </div>
                      <Progress
                        value={30} // This would be calculated based on user progress
                        className="h-2 bg-gray-200 dark:bg-gray-700"
                        indicatorClassName={`bg-gradient-to-r ${getRarityGradient(selectedBadge.rarity)}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {currentBadges.length > 0 ? (
                currentBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      rotate: badge.unlocked ? [0, -1, 1, 0] : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`relative cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${badge.color} border-2 ${badge.borderColor} ${selectedBadge?.id === badge.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleBadgeClick(badge)}
                  >
                    {/* Rare badge indicator */}
                    {badge.rare && badge.unlocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      </div>
                    )}

                    <div className="p-4 flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className={`relative rounded-full p-1 bg-white border ${badge.borderColor}`}>
                          <div className="rounded-full overflow-hidden relative w-12 h-12">
                            <img
                              src={badge.image || "/placeholder.svg"}
                              alt={badge.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Lock overlay for locked badges */}
                        {!badge.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30">
                            <Lock className="h-5 w-5 text-white opacity-80" />
                          </div>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-bold line-clamp-1 ${badge.unlocked ? badge.textColor : "text-gray-500"}`}
                      >
                        {badge.title}
                      </h3>

                      <p
                        className={`text-xs text-center line-clamp-2 mt-1 ${badge.unlocked ? "text-gray-600 dark:text-gray-300" : "text-gray-500"}`}
                      >
                        {badge.description}
                      </p>

                      {/* Earned date for unlocked badges */}
                      {badge.unlocked && <p className="mt-1 text-xs text-gray-500">Earned {badge.date}</p>}
                    </div>

                    {/* Glowing effect for rare badges */}
                    {badge.rare && badge.unlocked && (
                      <motion.div
                        className="absolute inset-0 -z-10 opacity-0 bg-yellow-200 rounded-xl blur-md"
                        whileHover={{ opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-4 py-10 text-center text-gray-500">
                  <p>No badges match your search criteria</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get rarity classes
function getRarityClasses(rarity) {
  switch (rarity) {
    case "common":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    case "uncommon":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    case "rare":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    case "epic":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
    case "legendary":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  }
}

// Helper function to get rarity gradient
function getRarityGradient(rarity) {
  switch (rarity) {
    case "common":
      return "from-blue-400 to-blue-600"
    case "uncommon":
      return "from-green-400 to-green-600"
    case "rare":
      return "from-purple-400 to-purple-600"
    case "epic":
      return "from-orange-400 to-orange-600"
    case "legendary":
      return "from-yellow-400 to-yellow-600"
    default:
      return "from-gray-400 to-gray-600"
  }
}

// Confetti component
function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiPieces = []
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#7F5AF0", "#2CB67D"]

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 2 * Math.PI,
        rotation: Math.random() * 0.2 - 0.1,
        rotationSpeed: Math.random() * 0.01 - 0.005,
      })
    }

    // Animation loop
    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confettiPieces.forEach((piece) => {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate(piece.angle)

        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)

        ctx.restore()

        // Update position
        piece.y += piece.speed
        piece.angle += piece.rotationSpeed

        // Reset if off screen
        if (piece.y > canvas.height) {
          piece.y = -piece.size
          piece.x = Math.random() * canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-50"
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 50 }}
    />
  )
}
