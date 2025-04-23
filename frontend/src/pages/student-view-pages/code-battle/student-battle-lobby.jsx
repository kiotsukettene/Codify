import { useState, useEffect, useContext } from "react";
import { Rocket, Clock, ArrowLeft, CheckCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStudentStore } from "@/store/studentStore";
import { SocketContext } from "@/context/auth-context/SocketProvider";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

export default function StudentBattleLobby() {
  const { battleCode } = useParams();
  const navigate = useNavigate();
  const { student } = useStudentStore();
  const socket = useContext(SocketContext);

  const [battle, setBattle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [opponentStatus, setOpponentStatus] = useState({
    joined: false,
    ready: false
  });
  const [playerPositions, setPlayerPositions] = useState({
    currentPlayer: null,
    opponent: null,
    isCurrentPlayerCommander: false,
  });
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchBattleData = async () => {
      if (!battleCode || !student?._id) {
        setError("Invalid battle code or not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching battle data for:", {
          battleCode,
          currentStudentId: student._id,
        });

        const response = await axios.get(`${API_URL}/${battleCode}`, {
          withCredentials: true,
        });

        const battleData = response.data;

        if (!battleData) {
          setError("Battle not found");
          setIsLoading(false);
          return;
        }

        setBattle(battleData);

        // Get the current student's ID
        const currentStudentId = student._id;

        console.log("Comparing IDs:", {
          player1Id: battleData.player1?.id || battleData.player1,
          player2Id: battleData.player2?.id || battleData.player2,
          currentStudentId,
        });

        // Check if current student is player1 or player2
        const isPlayer1 = (battleData.player1?.id || battleData.player1) === currentStudentId;
        const isPlayer2 = (battleData.player2?.id || battleData.player2) === currentStudentId;
        const opponentId = isPlayer1 ? (battleData.player2?.id || battleData.player2) : (battleData.player1?.id || battleData.player1);

        console.log("Player check result:", {
          isPlayer1,
          isPlayer2,
          currentStudentId,
        });

        if (!isPlayer1 && !isPlayer2) {
          console.log("Player verification failed - student is not a selected player");
          setError("You are not selected for this battle.");
          setIsLoading(false);
          return;
        }

        // Set player positions based on who is logged in
        setPlayerPositions({
          currentPlayer: isPlayer1 ? battleData.player1 : battleData.player2,
          opponent: isPlayer1 ? battleData.player2 : battleData.player1,
          isCurrentPlayerCommander: isPlayer1, // player1 is always Commander
        });

        // Check both players' status
        const joinedPlayers = battleData.joinedPlayers || [];
        const readyPlayers = battleData.readyPlayers || [];
        
        setHasJoined(joinedPlayers.includes(currentStudentId));
        setIsReady(readyPlayers.includes(currentStudentId));
        
        setOpponentStatus({
          joined: joinedPlayers.includes(opponentId),
          ready: readyPlayers.includes(opponentId)
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching battle data:", error);
        setError(error.response?.data?.message || "Failed to load battle data.");
        setIsLoading(false);
      }
    };

    fetchBattleData();
  }, [battleCode, student?._id]);

  // Separate useEffect for socket connection and room joining
  useEffect(() => {
    if (!socket || !battle || !student?._id) return;

    // Join battle room only once when component mounts
    socket.emit("joinBattleRoom", battleCode);
    console.log(`Joined battle room ${battleCode}`);

    // Cleanup function to leave room when component unmounts
    return () => {
      console.log(`Leaving battle room ${battleCode}`);
      socket.emit("leaveBattleRoom", battleCode);
    };
  }, [socket, battleCode]); // Only re-run if socket or battleCode changes

  // Separate useEffect for socket event listeners
  useEffect(() => {
    if (!socket || !battle || !student?._id) return;

    const handleError = ({ message }) => {
      toast.error(message);
      setError(message);
    };

    const handlePlayerJoined = ({ battleId, studentId, message }) => {
      console.log("Player joined:", message);
      toast.success(message);
      
      setBattle(prev => ({
        ...prev,
        joinedPlayers: [...(prev.joinedPlayers || []), studentId]
      }));

      if (studentId === student._id) {
        setHasJoined(true);
      } else {
        setOpponentStatus(prev => ({
          ...prev,
          joined: true
        }));
      }
    };

    const handlePlayerReady = ({ battleId, studentId, message }) => {
      console.log("Player ready:", message);
      toast.success(message);
      
      setBattle(prev => ({
        ...prev,
        readyPlayers: [...(prev.readyPlayers || []), studentId]
      }));

      if (studentId === student._id) {
        setIsReady(true);
      } else {
        setOpponentStatus(prev => ({
          ...prev,
          ready: true
        }));
      }
    };

    const handleProfessorStart = () => {
      toast.success("Professor has started the battle!");
      setCountdownActive(true);
    };

    const handleBattleCancelled = () => {
      toast.error("Battle cancelled by professor");
      navigate("/student/dashboard");
    };

    // Add event listeners
    socket.on("error", handleError);
    socket.on("playerJoined", handlePlayerJoined);
    socket.on("playerReady", handlePlayerReady);
    socket.on("professorStartBattle", handleProfessorStart);
    socket.on("battleCancelled", handleBattleCancelled);

    // Cleanup function to remove event listeners
    return () => {
      socket.off("error", handleError);
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("playerReady", handlePlayerReady);
      socket.off("professorStartBattle", handleProfessorStart);
      socket.off("battleCancelled", handleBattleCancelled);
    };
  }, [socket, battle, student?._id, navigate]); // Only re-run if these dependencies change

  // Handle countdown
  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Navigate to battle page after a short delay to show the explosion effect
      setTimeout(() => {
        navigate(`/student/code-battle/main-arena/${battleCode}`);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [countdownActive, countdown, navigate, battleCode]);

  // Add screen shake effect for countdown
  useEffect(() => {
    if (countdownActive && countdown <= 3) {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.classList.add("screen-shake");

        setTimeout(() => {
          mainElement.classList.remove("screen-shake");
        }, 300);
      }
    }
  }, [countdown, countdownActive]);

  const handleJoinBattle = async () => {
    try {
      await axios.post(`${API_URL}/join/${battleCode}`, {}, { withCredentials: true });
      setHasJoined(true);
      socket.emit("joinBattleRoom", battleCode);
      toast.success("Successfully joined the lobby!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to join lobby";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleReadyClick = async () => {
    try {
      if (!hasJoined) {
        await handleJoinBattle();
      }
      
      setIsReady(true);
      socket.emit("playerReady", { 
        battleCode,
        studentId: student._id 
      });
      
      toast.success("You're ready for battle!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to mark as ready";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] text-white p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <div className="mt-4">Loading battle lobby...</div>
        </div>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="min-h-screen bg-[#0D0A1A] text-white p-6">
        <div className="text-center justify-center items-center flex flex-col h-full">
          <div className="text-red-600 text-3xl mb-4">{error || "Battle not found"}</div>
          <Button onClick={() => navigate("/student/dashboard")} variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0A1A] text-white">
      {/* Header */}
      <div className="bg-[#1A1625]/50 border-b border-purple-900/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              onClick={() => navigate("/student/dashboard")}
              className="text-purple-300 hover:text-purple-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-400" />
              {battle.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1 text-white bg-purple-900/20">
              <Trophy className="h-4 w-4 text-yellow-400" />
              {battle.challenges?.length || 3} Challenges
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-white bg-purple-900/20">
              <Clock className="h-4 w-4 text-purple-400" />
              {battle.duration} minutes
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">MISSION BRIEFING</h2>
          <p className="text-gray-300">
            Solve {battle.challenges?.length || 3} algorithm challenges in this cosmic coding battle!
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {battle.course?.name || "Programming Languages"} | {battle.program} {battle.section}
          </p>
        </div>

        {/* Player Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Player Card */}
          <div
            className={`p-6 rounded-lg border ${
              isReady ? "border-green-500/50 bg-[#1A1625]/50" : "border-purple-800/50 bg-[#1A1625]/50"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                    isReady ? "bg-green-500" : "bg-yellow-500"
                  } border-2 border-[#1A1625]`}
                ></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {playerPositions.currentPlayer?.name}
                  </h3>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    You
                  </Badge>
                </div>
                <Badge
                  className={`mt-1 ${isReady ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                >
                  {isReady ? "Systems Online" : "Awaiting Launch"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={isReady ? "text-green-400" : "text-yellow-400"}>
                  {isReady ? "Ready for Launch" : "Preparing Systems"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isReady ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"
                  }`}
                ></div>
              </div>
              {!hasJoined ? (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                  onClick={handleJoinBattle}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Join Lobby
                </Button>
              ) : !isReady ? (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                  onClick={handleReadyClick}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  I'm Ready
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 cursor-default transition-colors"
                  disabled
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ready for Battle
                </Button>
              )}
            </div>
          </div>

          {/* Opponent Card */}
          <div className={`p-6 rounded-lg border ${
            opponentStatus.ready 
              ? "border-green-500/50 bg-[#1A1625]/50" 
              : opponentStatus.joined 
              ? "border-yellow-500/50 bg-[#1A1625]/50"
              : "border-purple-800/50 bg-[#1A1625]/50"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                  opponentStatus.ready 
                    ? "bg-green-500" 
                    : opponentStatus.joined 
                    ? "bg-yellow-500"
                    : "bg-red-500"
                } border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {playerPositions.opponent?.name}
                </h3>
                <Badge className={`mt-1 ${
                  opponentStatus.ready 
                    ? "bg-green-500/20 text-green-400" 
                    : opponentStatus.joined 
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {opponentStatus.ready 
                    ? "Ready for Battle" 
                    : opponentStatus.joined 
                    ? "Joined - Not Ready"
                    : "Not Joined"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={
                  opponentStatus.ready 
                    ? "text-green-400" 
                    : opponentStatus.joined 
                    ? "text-yellow-400"
                    : "text-red-400"
                }>
                  {opponentStatus.ready 
                    ? "Ready for Launch" 
                    : opponentStatus.joined 
                    ? "Preparing Systems"
                    : "Not Joined"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                  opponentStatus.ready 
                    ? "bg-green-500 w-full" 
                    : opponentStatus.joined 
                    ? "bg-yellow-500 w-1/2"
                    : "bg-red-500 w-1/4"
                }`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {opponentStatus.ready 
                  ? "Player is ready for battle" 
                  : opponentStatus.joined 
                  ? "Waiting for player to get ready..."
                  : "Waiting for player to join..."}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Details */}
        <div className="bg-[#1A1625]/50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-400" />
            Mission Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-sm text-gray-400">Challenges</div>
              <div className="font-medium">{battle.challenges?.length || 3} coding challenges</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Estimated Time</div>
              <div className="font-medium">{battle.duration} minutes</div>
            </div>
          </div>
          <Separator className="my-4 bg-purple-900/50" />
          <p className="text-sm text-gray-400">
            {battle.description ||
              "Prepare for an interstellar coding challenge! You'll face algorithmic puzzles that will test your problem-solving skills. Work quickly and efficiently to outperform your opponent."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Waiting for professor to start the battle...</p>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
              onClick={() => navigate("/student/dashboard")}
            >
              ABORT MISSION
            </Button>
          </div>
        </div>
      </div>

      {/* Cinematic Countdown overlay */}
      {countdownActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Animated warning lights - flashing red border */}
            <motion.div
              className="absolute inset-0 border-8 border-red-500/70 rounded-xl"
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
                className="relative"
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
                      className={`text-[180px] font-bold text-[#E94560] mb-6 relative
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
                        className={`absolute inset-0 text-[180px] font-bold text-[#E94560] blur-md opacity-70 z-[-1]
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
    </div>
  );
}