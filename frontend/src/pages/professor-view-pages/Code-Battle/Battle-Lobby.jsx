import React, { useEffect, useState, useContext } from 'react';
import { Rocket, Clock, ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams, useNavigate } from 'react-router-dom';
import useBattleStore from '@/store/battleStore';
import toast from 'react-hot-toast';
import { SocketContext } from '@/context/auth-context/SocketProvider';
import { motion } from 'framer-motion';

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;
const LOBBY_WAIT_TIME = 300; // 5 minutes in seconds

const BattleLobby = () => {
  const { battleCode } = useParams();
  const navigate = useNavigate();
  const { battles, fetchBattles } = useBattleStore();
  const [battle, setBattle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState({
    player1: { joined: false, ready: false },
    player2: { joined: false, ready: false },
  });
  const [timeLeft, setTimeLeft] = useState(LOBBY_WAIT_TIME);
  const [battleStatus, setBattleStatus] = useState('waiting'); // waiting, started, completed
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const socket = useContext(SocketContext);

  // Fetch battle by battleCode for professor
  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const response = await fetch(`${API_URL}/professor/${battleCode}`, {
          credentials: 'include',
        });
        const data = await response.json();
        console.log("Fetched battle:", data);
        if (response.ok) {
          setBattle(data);
          setPlayers({
            player1: {
              joined: data.joinedPlayers.includes(data.player1.id),
              ready: false,
            },
            player2: {
              joined: data.joinedPlayers.includes(data.player2.id),
              ready: false,
            },
          });

          // Initialize timer from localStorage or set new
          const timerKey = `battleTimer_${battleCode}`;
          const storedTimer = localStorage.getItem(timerKey);
          if (storedTimer) {
            const { startTime, initialTime } = JSON.parse(storedTimer);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, initialTime - elapsed);
            setTimeLeft(remaining);
          } else {
            localStorage.setItem(
              timerKey,
              JSON.stringify({
                startTime: Date.now(),
                initialTime: LOBBY_WAIT_TIME,
              })
            );
            setTimeLeft(LOBBY_WAIT_TIME);
          }
        } else {
          setError(data.message || 'Battle not found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch battle error:", error);
        setError('Error fetching battle');
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    fetchBattle();
  }, [battleCode, navigate]);

  // Join battle room
  useEffect(() => {
    if (socket && battleCode) {
      socket.emit('joinBattleRoom', battleCode);
      console.log(`Joined battle room ${battleCode}`);
    }
  }, [socket, battleCode]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || battleStatus !== 'waiting') {
      if (timeLeft <= 0) {
        // Clean up localStorage when timer expires
        localStorage.removeItem(`battleTimer_${battleCode}`);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (players.player1.ready && players.player2.ready) {
            setBattleStatus('started');
            socket.emit('battleStart', { battleCode });
            localStorage.removeItem(`battleTimer_${battleCode}`);
            navigate(`/professor/code-battle/arena/${battleCode}`);
          } else {
            setBattleStatus('completed');
            socket.emit('battleCancelled', { battleCode });
            toast.error('Battle cancelled - players not ready in time');
            fetch(`${API_URL}/${battleCode}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ status: 'completed' }),
            });
            // Clean up notifications
            fetch(`${API_URL}/cleanup/${battleCode}`, {
              method: 'POST',
              credentials: 'include',
            });
            localStorage.removeItem(`battleTimer_${battleCode}`);
            navigate('/professor/code-battle');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, players, battleCode, socket, navigate, battleStatus]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !battle) return;
  
    socket.on("playerJoined", ({ battleId, studentId, message }) => {
      const playerKey = studentId === battle.player1.id ? "player1" : "player2";
      setPlayers(prev => ({
        ...prev,
        [playerKey]: { ...prev[playerKey], joined: true }
      }));
      toast.success(message);
    });
  
    socket.on("playerReady", ({ battleId, studentId, message }) => {
      const playerKey = studentId === battle.player1.id ? "player1" : "player2";
      setPlayers(prev => ({
        ...prev,
        [playerKey]: { ...prev[playerKey], joined: true, ready: true }
      }));
      toast.success(message);
  
      // If both players are ready, start countdown
      if (players.player1.ready && players.player2.ready) {
        let countdown = 5;
        const countdownInterval = setInterval(() => {
          if (countdown > 0) {
            toast.success(`Battle starting in ${countdown}...`);
            countdown--;
          } else {
            clearInterval(countdownInterval);
            socket.emit("battleStart", { battleCode });
            navigate(`/professor/code-battle/arena/${battleCode}`);
          }
        }, 1000);
      }
    });
  
    return () => {
      socket.off("playerJoined");
      socket.off("playerReady");
    };
  }, [socket, battle, players, battleCode, navigate]);

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
        navigate(`/professor/code-battle/arena/${battleCode}`);
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

  const formatTime = (seconds) => {
    if (seconds === null) return 'Loading...';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartBattle = async () => {
    if (players.player1.ready && players.player2.ready) {
      try {
        // Update battle status to active using the correct endpoint
        const response = await fetch(`${API_URL}/${battleCode}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'active' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update battle status');
        }

        setBattleStatus('started');
        socket.emit('professorStartBattle', { battleCode });
        setCountdownActive(true);
      } catch (error) {
        console.error('Error starting battle:', error);
        toast.error(error.message || 'Failed to start battle. Please try again.');
      }
    } else {
      toast.error('Both players must be ready before starting the battle');
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
          <Button onClick={() => navigate("/professor/code-battle")} variant="secondary">
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
              onClick={() => navigate("/professor/code-battle")}
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
            Monitor {battle.challenges?.length || 3} algorithm challenges in this cosmic coding battle!
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {battle.course.name} | {battle.course.program} {battle.course.section}
          </p>
          <p className="text-xl font-semibold text-yellow-400 mt-4">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>

        {/* Player Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Player 1 Card */}
          <div className={`p-6 rounded-lg border ${
            players.player1.ready 
              ? "border-green-500/50 bg-[#1A1625]/50" 
              : players.player1.joined 
              ? "border-yellow-500/50 bg-[#1A1625]/50"
              : "border-purple-800/50 bg-[#1A1625]/50"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                  players.player1.ready 
                    ? "bg-green-500" 
                    : players.player1.joined 
                    ? "bg-yellow-500"
                    : "bg-red-500"
                } border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {battle.player1.name}
                  </h3>
                </div>
                <Badge className={`mt-1 ${
                  players.player1.ready 
                    ? "bg-green-500/20 text-green-400" 
                    : players.player1.joined 
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {players.player1.ready 
                    ? "Ready for Battle" 
                    : players.player1.joined 
                    ? "Joined - Not Ready"
                    : "Not Joined"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={
                  players.player1.ready 
                    ? "text-green-400" 
                    : players.player1.joined 
                    ? "text-yellow-400"
                    : "text-red-400"
                }>
                  {players.player1.ready 
                    ? "Ready for Launch" 
                    : players.player1.joined 
                    ? "Preparing Systems"
                    : "Not Joined"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                  players.player1.ready 
                    ? "bg-green-500 w-full" 
                    : players.player1.joined 
                    ? "bg-yellow-500 w-1/2"
                    : "bg-red-500 w-1/4"
                }`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {players.player1.ready 
                  ? "Player is ready for battle" 
                  : players.player1.joined 
                  ? "Waiting for player to get ready..."
                  : "Waiting for player to join..."}
              </div>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className={`p-6 rounded-lg border ${
            players.player2.ready 
              ? "border-green-500/50 bg-[#1A1625]/50" 
              : players.player2.joined 
              ? "border-yellow-500/50 bg-[#1A1625]/50"
              : "border-purple-800/50 bg-[#1A1625]/50"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                  players.player2.ready 
                    ? "bg-green-500" 
                    : players.player2.joined 
                    ? "bg-yellow-500"
                    : "bg-red-500"
                } border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {battle.player2.name}
                  </h3>
                </div>
                <Badge className={`mt-1 ${
                  players.player2.ready 
                    ? "bg-green-500/20 text-green-400" 
                    : players.player2.joined 
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {players.player2.ready 
                    ? "Ready for Battle" 
                    : players.player2.joined 
                    ? "Joined - Not Ready"
                    : "Not Joined"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={
                  players.player2.ready 
                    ? "text-green-400" 
                    : players.player2.joined 
                    ? "text-yellow-400"
                    : "text-red-400"
                }>
                  {players.player2.ready 
                    ? "Ready for Launch" 
                    : players.player2.joined 
                    ? "Preparing Systems"
                    : "Not Joined"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                  players.player2.ready 
                    ? "bg-green-500 w-full" 
                    : players.player2.joined 
                    ? "bg-yellow-500 w-1/2"
                    : "bg-red-500 w-1/4"
                }`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {players.player2.ready 
                  ? "Player is ready for battle" 
                  : players.player2.joined 
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
            {battle.description || "Oversee an interstellar coding challenge! Monitor as students face algorithmic puzzles that test their problem-solving skills. Ensure the battle runs smoothly and declare the victor."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-700 min-w-[200px] transition-colors"
            onClick={handleStartBattle}
            disabled={!players.player1.ready || !players.player2.ready || battleStatus !== 'waiting'}
          >
            <Rocket className="h-5 w-5 mr-2" />
            LAUNCH SEQUENCE
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
            onClick={() => navigate("/professor/code-battle")}
          >
            ABORT MISSION
          </Button>
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
};

export default BattleLobby;