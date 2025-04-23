"use client"

import { useEffect, useState } from "react"
import { Award, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { getBadgeById } from "./badges-mock-data"

const BadgeModal = ({
  isOpen,
  onClose,
  badgeId = "speed-demon", // Default badge ID
  onViewAllBadges,
  playSoundEffect = true,
}) => {
  const [animationStage, setAnimationStage] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [typedDescription, setTypedDescription] = useState("")

  // Get badge data from ID
  const badge = getBadgeById(badgeId)
  const badgeTitle = badge.name
  const badgeDescription = badge.description
  const badgeColor = badge.color
  const badgeImage = badge.image || null

  // Reset animation when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setAnimationStage(0)
        setTypedText("")
        setTypedDescription("")
      }, 300)
    }
  }, [isOpen])

  // Progress through animation stages
  useEffect(() => {
    if (!isOpen) return

    const timers = []

    // Play landing sound
    if (animationStage === 0 && playSoundEffect) {
      try {
        const audio = new Audio("/space-whoosh.mp3")
        audio.volume = 0.4
        audio.play().catch((e) => console.log("Audio play failed:", e))
      } catch (error) {
        console.log("Audio not supported")
      }

      // Move to next stage after delay
      timers.push(setTimeout(() => setAnimationStage(1), 1500))
    }

    // Play landing sound
    if (animationStage === 1 && playSoundEffect) {
      try {
        const audio = new Audio("/capsule-land.mp3")
        audio.volume = 0.5
        audio.play().catch((e) => console.log("Audio play failed:", e))
      } catch (error) {
        console.log("Audio not supported")
      }

      // Move to next stage after delay
      timers.push(setTimeout(() => setAnimationStage(2), 1000))
    }

    // Play opening sound
    if (animationStage === 2 && playSoundEffect) {
      try {
        const audio = new Audio("/capsule-open.mp3")
        audio.volume = 0.5
        audio.play().catch((e) => console.log("Audio play failed:", e))
      } catch (error) {
        console.log("Audio not supported")
      }

      // Move to next stage after delay
      timers.push(setTimeout(() => setAnimationStage(3), 1500))
    }

    // Play badge reveal sound
    if (animationStage === 3 && playSoundEffect) {
      try {
        const audio = new Audio("/badge-reveal.mp3")
        audio.volume = 0.5
        audio.play().catch((e) => console.log("Audio play failed:", e))
      } catch (error) {
        console.log("Audio not supported")
      }

      // Start typing animation
      let currentText = ""
      const fullText = `"${badgeTitle}" Badge`
      let charIndex = 0

      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          currentText += fullText[charIndex]
          setTypedText(currentText)
          charIndex++
        } else {
          clearInterval(typeInterval)

          // Start description typing
          let descText = ""
          const fullDesc = `"${badgeDescription}"`
          let descIndex = 0

          const descInterval = setInterval(() => {
            if (descIndex < fullDesc.length) {
              descText += fullDesc[descIndex]
              setTypedDescription(descText)
              descIndex++
            } else {
              clearInterval(descInterval)
            }
          }, 30)

          timers.push(setTimeout(() => clearInterval(descInterval), 5000))
        }
      }, 50)

      timers.push(setTimeout(() => clearInterval(typeInterval), 5000))
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [animationStage, isOpen, badgeTitle, badgeDescription, playSoundEffect])

  if (!isOpen) return null

  // SVG for space capsule
  const SpaceCapsule = ({ isOpen, isLanded }) => (
    <motion.svg
      width="140"
      height="200"
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={isLanded ? { y: 0, rotate: 0 } : { y: -200, rotate: 5 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: isLanded ? 10 : 5,
        mass: 1,
      }}
    >
      {/* Smoke trail */}
      <AnimatePresence>
        {!isLanded && (
          <>
            <motion.ellipse
              cx="60"
              cy="170"
              rx="15"
              ry="5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.5, 2, 3], y: [0, 20, 40] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              fill="rgba(200, 200, 255, 0.3)"
            />
            <motion.ellipse
              cx="55"
              cy="170"
              rx="10"
              ry="3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 2.5], y: [0, 15, 30] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.3 }}
              fill="rgba(200, 200, 255, 0.2)"
            />
            <motion.ellipse
              cx="65"
              cy="170"
              rx="12"
              ry="4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.8, 2.8], y: [0, 25, 35] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.6 }}
              fill="rgba(200, 200, 255, 0.25)"
            />
          </>
        )}
      </AnimatePresence>

      {/* Capsule body */}
      <motion.path
        d="M60 10 L40 50 L40 140 L80 140 L80 50 Z"
        fill="#2D3748"
        stroke="#4A5568"
        strokeWidth="2"
        animate={
          isOpen
            ? {
                d: "M60 10 L30 50 L30 140 L90 140 L90 50 Z",
                fill: "#2D3748",
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      />

      {/* Capsule window */}
      <motion.circle cx="60" cy="40" r="15" fill="#90CDF4" animate={isOpen ? { fill: "#63B3ED" } : {}} />

      {/* Capsule top */}
      <motion.path d="M40 50 L60 10 L80 50 Z" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />

      {/* Capsule bottom */}
      <motion.path d="M40 140 L60 150 L80 140 Z" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />

      {/* Capsule door - left */}
      <motion.path
        d="M40 50 L40 140 L60 140 L60 50 Z"
        fill="#4A5568"
        stroke="#2D3748"
        strokeWidth="1"
        animate={isOpen ? { x: -15 } : { x: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      />

      {/* Capsule door - right */}
      <motion.path
        d="M60 50 L60 140 L80 140 L80 50 Z"
        fill="#4A5568"
        stroke="#2D3748"
        strokeWidth="1"
        animate={isOpen ? { x: 15 } : { x: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      />

      {/* Glow when opening */}
      <AnimatePresence>
        {isOpen && (
          <motion.ellipse
            cx="60"
            cy="95"
            rx="15"
            ry="40"
            fill="url(#capsuleGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Gradient definition */}
      <defs>
        <radialGradient id="capsuleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#90CDF4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  )

  // Particles for the badge reveal
  const Particles = ({ isVisible, color }) => {
    const particles = Array(20)
      .fill()
      .map((_, i) => ({
        size: Math.random() * 6 + 2,
        distance: Math.random() * 100 + 60, // Increased distance
        angle: (Math.PI * 2 * i) / 20 + Math.random() * 0.5,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 0.5,
      }))

    // Convert hex to rgba
    const hexToRgba = (hex, alpha = 1) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const particleColor = color ? hexToRgba(color, 0.8) : "rgba(144, 205, 244, 0.8)"
    const glowColor = color ? hexToRgba(color, 0.9) : "rgba(144, 205, 244, 0.9)"

    return (
      <AnimatePresence>
        {isVisible && (
          <>
            {particles.map((particle, i) => {
              const x = Math.cos(particle.angle) * particle.distance
              const y = Math.sin(particle.angle) * particle.distance

              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particleColor,
                    boxShadow: `0 0 12px ${glowColor}`, // Enhanced glow with badge color
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, x * 0.3, x],
                    y: [0, y * 0.3, y],
                    opacity: [0, 1, 0],
                    scale: [1, 1.5, 0.8],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: particle.delay,
                    ease: "linear",
                  }}
                />
              )
            })}

            {/* Orbital rings - enhanced glow with badge color */}
            <motion.div
              className="absolute rounded-full border-2"
              style={{
                width: "120px",
                height: "120px",
                borderColor: particleColor,
                boxShadow: `0 0 15px ${glowColor}`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.5, 2],
                rotate: [0, 180],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute rounded-full border-2"
              style={{
                width: "100px",
                height: "100px",
                borderColor: particleColor,
                boxShadow: `0 0 15px ${glowColor}`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.3, 1.8],
                rotate: [0, -120],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: 0.5,
              }}
            />
          </>
        )}
      </AnimatePresence>
    )
  }

  // Landing platform
  const LandingPlatform = ({ isGlowing, color }) => {
    const glowColor = color
      ? `rgba(${Number.parseInt(color.slice(1, 3), 16)}, ${Number.parseInt(color.slice(3, 5), 16)}, ${Number.parseInt(color.slice(5, 7), 16)}, 0.9)`
      : "rgba(144, 205, 244, 0.9)"

    return (
      <motion.div
        className="relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: isGlowing ? [0.95, 1.05, 1] : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-[160px] h-[20px] rounded-full bg-gray-700 mx-auto"
          animate={{
            boxShadow: isGlowing ? `0 0 25px ${glowColor}` : "0 0 5px rgba(74, 85, 104, 0.5)",
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="w-[120px] h-[10px] rounded-full bg-gray-600 mx-auto mt-[-5px]"
          animate={{
            boxShadow: isGlowing ? `0 0 20px ${glowColor}` : "none",
          }}
        />
      </motion.div>
    )
  }

  // Badge image component - UPDATED to use h-44 w-44 Tailwind classes
  const BadgeImage = ({ src, isVisible }) => {
    if (!src) {
      // Fallback to Award icon if no image
      return (
        <motion.div
          className="text-7xl filter h-44 w-44 flex items-center justify-center"
          style={{
            filter: `drop-shadow(0 0 25px ${badgeColor}99)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Award size={176} color={badgeColor || "#FFD700"} />
        </motion.div>
      )
    }

    return (
      <motion.div
        className="relative h-44 w-44"
        style={{
          filter: `drop-shadow(0 0 25px ${badgeColor}99)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={badgeTitle}
          className="w-full h-full object-contain"
          style={{
            filter: `drop-shadow(0 0 15px ${badgeColor}99)`,
          }}
        />
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        className="bg-gray-900 rounded-2xl p-6 w-[90%] max-w-md relative shadow-[0_0_40px_rgba(90,90,255,0.4)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-200 z-50"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center justify-center p-5 relative h-[500px]">
          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array(50)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.random() * 2 + 1 + "px",
                    height: Math.random() * 2 + 1 + "px",
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`,
                  }}
                />
              ))}
          </div>
          {/* Landing platform */}
          <div className="absolute bottom-[160px]">
            <LandingPlatform isGlowing={animationStage >= 1} color={badgeColor} />
          </div>
          {/* Space capsule */}
          <div className="absolute" style={{ bottom: animationStage >= 1 ? "180px" : "80px" }}>
            <SpaceCapsule isOpen={animationStage >= 2} isLanded={animationStage >= 1} />
          </div>
          {/* Badge reveal */}
          <div className="absolute" style={{ bottom: "220px" }}>
            <AnimatePresence>
              {animationStage >= 3 && (
                <motion.div
                  className="relative flex items-center justify-center"
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.3,
                  }}
                >
                  {/* Particles around badge */}
                  <Particles isVisible={animationStage >= 3} color={badgeColor} />

                  {/* Badge image - using actual badge images */}
                  <BadgeImage src={badgeImage} isVisible={animationStage >= 3} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Text container - moved down */}
          <div className="absolute bottom-[80px] w-full flex flex-col items-center">
            {/* Badge title with typewriter effect */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStage >= 3 ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h3 className="text-2xl font-bold mb-2 mt-2" style={{ color: badgeColor || "#63B3ED" }}>
                {typedText}
                {typedText.length < `"${badgeTitle}" Badge`.length && animationStage >= 3 && (
                  <span
                    className="inline-block w-1 h-6 ml-1 animate-pulse"
                    style={{ backgroundColor: badgeColor || "#63B3ED" }}
                  ></span>
                )}
              </motion.h3>

              <motion.div
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: typedText.length === `"${badgeTitle}" Badge`.length ? 1 : 0,
                  y: typedText.length === `"${badgeTitle}" Badge`.length ? 0 : 10,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  color: badgeColor || "#63B3ED",
                  textShadow: `0 0 10px ${badgeColor}99 || rgba(144, 205, 244, 0.8)`,
                }}
              >
                Unlocked!
              </motion.div>
            </motion.div>

            {/* Badge description with typewriter effect */}
            <motion.p
              className="text-base text-gray-400 text-center mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStage >= 3 ? 1 : 0 }}
              transition={{ delay: 1 }}
            >
              {typedDescription}
              {typedDescription.length < `"${badgeDescription}"`.length && animationStage >= 3 && (
                <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
              )}
            </motion.p>
          </div>
          {/* Buttons - moved to bottom */}
          <motion.div
            className="flex justify-between w-full gap-3 absolute bottom-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: animationStage >= 3 && typedDescription.length === `"${badgeDescription}"`.length ? 1 : 0,
              y: animationStage >= 3 && typedDescription.length === `"${badgeDescription}"`.length ? 0 : 20,
            }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="flex-1 bg-transparent hover:bg-opacity-30"
              style={{
                borderColor: badgeColor || "#3182CE",
                color: badgeColor || "#63B3ED",
                hoverBackgroundColor: `${badgeColor}20` || "#3182CE20",
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (onViewAllBadges) onViewAllBadges()
                onClose()
              }}
            >
              View All Badges
            </Button>
            <Button
              className="flex-1 text-white"
              style={{
                backgroundColor: badgeColor || "#3182CE",
                hover: { backgroundColor: badgeColor ? `${badgeColor}dd` : "#2C5282" },
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default BadgeModal
