"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Rocket, Clock, ArrowLeft, CheckCircle, AlertCircle, Trophy, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample player data
const samplePlayers = [
  {
    id: "player1",
    name: "Commander Alex",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "ready", // ready, waiting, loading
    isYou: true,
  },
  {
    id: "player2",
    name: "Pilot Jordan",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "waiting",
    isYou: false,
  },
]

// Sample battle data
const battleData = {
  id: "battle-123",
  title: "Algorithmic Space Odyssey",
  description: "Solve 3 algorithm challenges in this cosmic coding battle!",
  challenges: 3,
  estimatedTime: "30 minutes",
}

// Sample chat messages
const initialChatMessages = [
  {
    id: 1,
    playerId: "player1",
    playerName: "Commander Alex",
    message: "Hey, ready for the battle?",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 2,
    playerId: "player2",
    playerName: "Pilot Jordan",
    message: "Almost! Just reviewing some algorithms first.",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
]

export default function StudentBattleLobby() {
  const [players, setPlayers] = useState(samplePlayers)
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [countdownActive, setCountdownActive] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Get current player (you)
  const currentPlayer = players.find((p) => p.isYou)
  const otherPlayer = players.find((p) => !p.isYou)

  // Check if all players are ready
  const allPlayersReady = players.every((player) => player.status === "ready")

  // Toggle ready status for current player
  const toggleReady = () => {
    setPlayers(
      players.map((player) =>
        player.isYou ? { ...player, status: player.status === "ready" ? "waiting" : "ready" } : player,
      ),
    )
  }

  // Start battle countdown
  const startBattle = () => {
    if (allPlayersReady) {
      setCountdownActive(true)
    }
  }

  // Handle countdown
  useEffect(() => {
    let timer
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      // Navigate to battle page
      console.log("Starting battle...")
      // In a real app, you would navigate to the battle page
      // router.push('/battle')
    }

    return () => clearTimeout(timer)
  }, [countdownActive, countdown])

  // Add screen shake effect for countdown
  useEffect(() => {
    if (countdownActive && countdown <= 3) {
      // Play a tick sound effect here if needed

      // Create screen shake effect
      const mainElement = document.querySelector("main")
      if (mainElement) {
        mainElement.classList.add("screen-shake")

        setTimeout(() => {
          mainElement.classList.remove("screen-shake")
        }, 300)
      }
    }
  }, [countdown, countdownActive])

  // Add this useEffect for sound effects
  useEffect(() => {
    if (countdownActive) {
      // This is where you would implement the sound effects
      // Since we can't actually play sounds in this environment, I'm adding comments

      // Example implementation:
      // const tickVolume = countdown <= 3 ? 0.8 : countdown <= 5 ? 0.5 : 0.3;
      // const tickRate = countdown <= 3 ? 1.5 : 1;
      // playTickSound(tickVolume, tickRate);

      // For the final blast:
      // if (countdown === 0) {
      //   playBlastOffSound();
      // }

      console.log(`Countdown tick: ${countdown} - Would play sound at volume: ${countdown <= 3 ? "high" : "normal"}`)
    }
  }, [countdown, countdownActive])

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "ready":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Systems Online
            </span>
          </Badge>
        )
      case "waiting":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
              Awaiting Launch
            </span>
          </Badge>
        )
      case "loading":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
            <span className="flex items-center gap-1">
              <Loader className="h-3 w-3 animate-spin" />
              Calibrating
            </span>
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
        <div className="nebula"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-[#18122B]/80 backdrop-blur-md border-b border-[#2B1F4A] sticky top-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="p-1 h-8 w-8 hover:bg-[#2B1F4A] rounded-full text-[#C2C2DD] hover:text-[#F5F5F5]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-base font-bold flex items-center gap-1 truncate font-['Orbitron']">
              <Rocket className="h-4 w-4 text-[#B689F4]" />
              <span className="truncate">{battleData.title}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#231b3d]/80 backdrop-blur-md border border-[#2B1F4A] px-3 py-1 rounded text-sm flex items-center gap-1">
              <Trophy className="h-3 w-3 text-yellow-400" />
              <span className="text-sm">{battleData.challenges} Challenges</span>
            </div>
            <div className="bg-[#231b3d]/80 backdrop-blur-md border border-[#2B1F4A] px-3 py-1 rounded text-sm flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#E94560]" />
              <span className="text-sm">{battleData.estimatedTime}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container max-w-full mx-auto py-6 px-4 relative">
          {/* Battle info */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-[#B689F4] font-['Orbitron'] tracking-wider">
              MISSION BRIEFING
            </h1>
            <p className="text-[#C2C2DD] max-w-2xl mx-auto">{battleData.description}</p>
          </div>

          {/* Cinematic Countdown overlay */}
          {countdownActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Animated warning lights - flashing red border */}
                <motion.div
                  className="absolute inset-0 border-8 border-purple-300 rounded-xl"
                  animate={{
                    opacity: countdown <= 5 ? [0.2, 1, 0.2] : [0.1, 0.3, 0.1],
                    boxShadow:
                      countdown <= 5
                        ? [
                            "0 0 30px rgba(239, 68, 68, 0.3)",
                            "0 0 60px rgba(239, 68, 68, 0.8)",
                            "0 0 30px rgba(239, 68, 68, 0.3)",
                          ]
                        : [
                            "0 0 20px rgba(239, 68, 68, 0.1)",
                            "0 0 30px rgba(239, 68, 68, 0.3)",
                            "0 0 20px rgba(239, 68, 68, 0.1)",
                          ],
                  }}
                  transition={{
                    duration: countdown <= 3 ? 0.5 : 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Heartbeat pulse overlay */}
                <motion.div
                  className="absolute inset-0 bg-red-500/5"
                  animate={{
                    opacity: [0.05, 0.2, 0.05],
                    scale: [0.98, 1, 0.98],
                  }}
                  transition={{
                    duration: countdown <= 3 ? 0.5 : 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <div className="text-center p-16 relative overflow-hidden w-full max-w-4xl">
                  {/* Pressure messaging */}
                  <motion.h2
                    className="text-3xl font-bold mb-8 text-[#B689F4] font-['Orbitron'] tracking-widest"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {countdown > 5
                      ? "T-MINUS LAUNCH SEQUENCE"
                      : countdown > 3
                        ? "MISSION LOCKED. NO TURNING BACK."
                        : countdown > 1
                          ? "PRESSURE LEVELS RISING..."
                          : countdown > 0
                            ? "GOING LIVE..."
                            : "BLAST OFF!"}
                  </motion.h2>

                  {/* Main countdown number */}
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: [0, 1, 0.8],
                      y: [10, 0, 0],
                    }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative "
                  >
                    <motion.div
                      animate={{
                        x: countdown <= 3 ? [0, -4, 4, -4, 0] : 0,
                        y: countdown <= 3 ? [0, -2, 2, -2, 0] : 0,
                      }}
                      transition={{
                        duration: countdown <= 3 ? 0.3 : 0.5,
                        repeat: countdown <= 3 ? 1 : 0,
                        repeatType: "mirror",
                      }}
                    >
                      {countdown > 0 ? (
                        <div
                          className={`text-[27rem] font-bold text-primary mb-3 relative
                  ${
                    countdown === 5
                      ? "font-mono"
                      : countdown === 4
                        ? "font-serif"
                        : countdown === 3
                          ? "font-['Orbitron']"
                          : countdown === 2
                            ? "font-sans italic"
                            : countdown === 1
                              ? "font-['Impact']"
                              : "font-mono"
                  }`}
                        >
                          {countdown}

                          {/* Glow effect */}
                          <div
                            className={`absolute inset-0 text-[27rem]font-bold text-primary blur-md opacity-70 z-[-1]
                    ${
                      countdown === 5
                        ? "font-mono"
                        : countdown === 4
                          ? "font-serif"
                          : countdown === 3
                            ? "font-['Orbitron']"
                            : countdown === 2
                              ? "font-sans italic"
                              : countdown === 1
                                ? "font-['Impact']"
                                : "font-mono"
                    }`}
                          >
                            {countdown}
                          </div>
                        </div>
                      ) : (
                        // Explosion effect at zero
                        <motion.div
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 0, scale: 2 }}
                          transition={{ duration: 1 }}
                          className="relative"
                        >
                          <div className="text-[180px] font-bold text-white mb-6 opacity-0">0</div>
                          {/* Particle explosion */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(30)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-[#E94560] rounded-full"
                                initial={{
                                  x: 0,
                                  y: 0,
                                  opacity: 1,
                                }}
                                animate={{
                                  x: Math.sin((i * 12 * Math.PI) / 180) * (100 + Math.random() * 200),
                                  y: Math.cos((i * 12 * Math.PI) / 180) * (100 + Math.random() * 200),
                                  opacity: 0,
                                  scale: Math.random() * 3,
                                }}
                                transition={{
                                  duration: 1.5,
                                  ease: "easeOut",
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Particle effects for final countdown */}
                    {countdown <= 3 && countdown > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-red-500 rounded-full"
                            initial={{
                              x: 0,
                              y: 0,
                              opacity: 1,
                            }}
                            animate={{
                              x: Math.sin((i * 30 * Math.PI) / 180) * 150,
                              y: Math.cos((i * 30 * Math.PI) / 180) * 150,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: 1,
                              repeatType: "loop",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Status text */}
                  <motion.p
                    className="text-[#C2C2DD] mt-8 font-['Orbitron'] text-xl"
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      textShadow: [
                        "0 0 8px rgba(194, 194, 221, 0.3)",
                        "0 0 12px rgba(194, 194, 221, 0.6)",
                        "0 0 8px rgba(194, 194, 221, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {countdown <= 0
                      ? "MISSION COMMENCING"
                      : countdown <= 3
                        ? "CRITICAL SYSTEMS ENGAGED"
                        : "PREPARE FOR CODING BATTLE"}
                  </motion.p>

                  {/* Horizontal scan line effect */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-[#E94560]/30 z-10"
                    initial={{ top: -10 }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Blast-off animation */}
                {countdown === 0 && (
                  <motion.div
                    className="absolute inset-0 bg-white z-30"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      y: [0, -1000],
                    }}
                    transition={{
                      duration: 2,
                      times: [0, 0.1, 1],
                      ease: "easeOut",
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Players section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-lg border ${
                  player.status === "ready"
                    ? "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "border-[#2B1F4A]"
                } bg-gradient-to-b from-[#18122B]/90 to-[#231b3d]/90 backdrop-blur-md`}
              >
                {/* Player card interior - spaceship dashboard style */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B689F4]/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E94560]/30 to-transparent"></div>

                  {/* Radar blips */}
                  {player.status === "ready" && (
                    <>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-green-500/20"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-green-500/15"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-green-500/10"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500/50 animate-ping"></div>
                    </>
                  )}
                </div>

                {/* Player info */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div
                        className={`h-16 w-16 rounded-full overflow-hidden border-2 ${
                          player.status === "ready" ? "border-green-500" : "border-[#2B1F4A]"
                        } bg-[#0D0A1A]`}
                      >
                        <img
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${
                          player.status === "ready" ? "bg-green-500" : "bg-yellow-500"
                        } border-2 border-[#18122B]`}
                      ></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-['Orbitron']">{player.name}</h3>
                        {player.isYou && <Badge className="bg-[#B689F4]/20 text-[#B689F4] border-[#B689F4]">You</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#C2C2DD]">{player.isYou ? "Commander" : "Pilot"}</span>
                        {getStatusBadge(player.status)}
                      </div>
                    </div>
                  </div>

                  {/* Player controls - only show for current player */}
                  {player.isYou && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#C2C2DD]">Mission Status:</span>
                        <span className={`text-sm ${player.status === "ready" ? "text-green-400" : "text-yellow-400"}`}>
                          {player.status === "ready" ? "Ready for Launch" : "Preparing Systems"}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-[#0D0A1A] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            player.status === "ready" ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2 animate-pulse"
                          }`}
                        ></div>
                      </div>
                      <Button
                        onClick={toggleReady}
                        className={`w-full ${
                          player.status === "ready"
                            ? "bg-[#2B1F4A] hover:bg-[#3B2F5A] text-[#C2C2DD]"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {player.status === "ready" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" /> I'm Ready
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" /> Mark as Ready
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Other player's status */}
                  {!player.isYou && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#C2C2DD]">Mission Status:</span>
                        <span className={`text-sm ${player.status === "ready" ? "text-green-400" : "text-yellow-400"}`}>
                          {player.status === "ready" ? "Ready for Launch" : "Preparing Systems"}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-[#0D0A1A] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            player.status === "ready" ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2 animate-pulse"
                          }`}
                        ></div>
                      </div>
                      <div className="text-center text-sm text-[#C2C2DD]">
                        {player.status === "ready"
                          ? "Player is ready and waiting for battle"
                          : "Waiting for player to get ready..."}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Battle info card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-[#18122B]/90 backdrop-blur-md border border-[#2B1F4A] rounded-lg p-6"
          >
            <h2 className="text-xl font-bold mb-4 font-['Orbitron'] flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#B689F4]" />
              Mission Details
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-[#C2C2DD] mb-1">Challenges</h3>
                <p className="font-medium">{battleData.challenges} coding challenges</p>
              </div>
              <div>
                <h3 className="text-sm text-[#C2C2DD] mb-1">Estimated Time</h3>
                <p className="font-medium">{battleData.estimatedTime}</p>
              </div>
            </div>

            <Separator className="my-4 bg-[#2B1F4A]" />

            <div className="text-sm text-[#C2C2DD]">
              <p>
                Prepare for an interstellar coding challenge! You'll face {battleData.challenges} algorithmic puzzles
                that will test your problem-solving skills. Work quickly and efficiently to outperform your opponent.
              </p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={startBattle}
                      disabled={!allPlayersReady}
                      className={`w-full ${
                        allPlayersReady
                          ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20 animate-pulse"
                          : "bg-[#2B1F4A] text-[#C2C2DD] cursor-not-allowed"
                      } font-['Orbitron'] text-lg py-6`}
                    >
                      <Rocket className="h-5 w-5 mr-2" /> LAUNCH SEQUENCE
                    </Button>
                  </div>
                </TooltipTrigger>
                {!allPlayersReady && (
                  <TooltipContent>
                    <p>Waiting for all players to be ready</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              className="border-[#E94560] text-[#E94560] hover:bg-[#E94560]/20 hover:text-[#E94560] font-['Orbitron']"
            >
              ABORT MISSION
            </Button>
          </div>
        </main>
      </div>

      {/* CSS for animated background */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .stars-small, .stars-medium, .stars-large {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .stars-small {
          background-image: radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 4s ease-in-out infinite;
          opacity: 0.3;
        }
        
        .stars-medium {
          background-image: radial-gradient(1.5px 1.5px at 50px 160px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 130px 80px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 300px 300px;
          animation: twinkle 6s ease-in-out infinite;
          opacity: 0.4;
        }
        
        .stars-large {
          background-image: radial-gradient(2px 2px at 100px 50px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 200px 150px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 300px 250px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 400px 400px;
          animation: twinkle 8s ease-in-out infinite;
          opacity: 0.5;
        }
        
        .nebula {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at top right, rgba(182, 137, 244, 0.1) 0%, rgba(0,0,0,0) 60%),
                      radial-gradient(ellipse at bottom left, rgba(233, 69, 96, 0.1) 0%, rgba(0,0,0,0) 60%);
          pointer-events: none;
        }

        @keyframes screenShake {
          0% { transform: translate(0); }
          10% { transform: translate(-2px, -2px); }
          20% { transform: translate(2px, -2px); }
          30% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-2px, 2px); }
          80% { transform: translate(2px, 2px); }
          90% { transform: translate(-2px, -2px); }
          100% { transform: translate(0); }
        }

        .screen-shake {
          animation: screenShake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes pulse-glow {
          0% { text-shadow: 0 0 10px rgba(233, 69, 96, 0.5), 0 0 20px rgba(233, 69, 96, 0.3); }
          50% { text-shadow: 0 0 20px rgba(233, 69, 96, 0.8), 0 0 40px rgba(233, 69, 96, 0.5); }
          100% { text-shadow: 0 0 10px rgba(233, 69, 96, 0.5), 0 0 20px rgba(233, 69, 96, 0.3); }
        }
      `}</style>
    </div>
  )
}
