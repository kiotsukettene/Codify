import React, {useState, useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Flame, Sword, Shield, Trophy, ArrowRight } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import ProfCodeEditor from '@/components/Prof-Code-Editor'
import { motion, AnimatePresence } from "framer-motion"
import Bear from "@/assets/picture/Avatar/Bear.png"
import useBattleStore from '@/store/battleStore'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SocketContext } from '@/context/auth-context/SocketProvider'

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

const CodeBattle = () => {
    const { battleCode } = useParams();
    const navigate = useNavigate();
    const [battleState, setBattleState] = useState({
        timer: "",
        status: "active",
        showCountdown: false,
        winner: null
    });

    const [battle, setBattle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [playersState, setPlayersState] = useState({});
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerDetails, setWinnerDetails] = useState(null);

    const socket = useContext(SocketContext);

    // Initialize timer when battle data is loaded
    useEffect(() => {
        if (battle && battle.duration) {
            // Check if we already have an end time stored
            const storedEndTime = localStorage.getItem(`battle_${battleCode}_end_time`);
            
            if (!storedEndTime) {
                // If no stored end time, calculate and store it
                const endTime = Date.now() + (battle.duration * 60 * 1000);
                localStorage.setItem(`battle_${battleCode}_end_time`, endTime.toString());
            }
            
            // Calculate initial remaining time
            const endTime = parseInt(storedEndTime || Date.now() + (battle.duration * 60 * 1000));
            const remainingTime = Math.max(0, endTime - Date.now());
            const minutes = Math.floor(remainingTime / (60 * 1000));
            const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
            
            setBattleState(prev => ({
                ...prev,
                timer: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                status: remainingTime <= 0 ? "completed" : "active"
            }));

            // If battle is already over, trigger end handling
            if (remainingTime <= 0) {
                handleBattleEnd();
            }
        }
    }, [battle, battleCode]);

    // Timer countdown effect
    useEffect(() => {
        let interval;
        if (battle && battleState.status === "active") {
            interval = setInterval(() => {
                const endTime = parseInt(localStorage.getItem(`battle_${battleCode}_end_time`));
                if (!endTime) return;

                const now = Date.now();
                const remainingTime = Math.max(0, endTime - now);
                
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    handleBattleEnd();
                    setBattleState(prev => ({
                        ...prev,
                        status: "completed",
                        timer: "00:00"
                    }));
                    return;
                }

                const minutes = Math.floor(remainingTime / (60 * 1000));
                const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
                
                setBattleState(prev => ({
                    ...prev,
                    timer: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                }));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [battle, battleState.status, battleCode]);

    // Clean up localStorage when component unmounts
    useEffect(() => {
        return () => {
            if (battleState.status === "completed") {
                localStorage.removeItem(`battle_${battleCode}_end_time`);
            }
        };
    }, [battleCode, battleState.status]);

    // Add socket event listeners
    useEffect(() => {
        if (socket && battleCode) {
            // Join battle room
            socket.emit("joinBattleRoom", battleCode);

            // Listen for player code updates
            socket.on("codeUpdate", ({ playerId, code, language }) => {
                console.log(`Received code update from player ${playerId}`);
                setPlayersState(prev => ({
                    ...prev,
                    [playerId]: {
                        ...prev[playerId],
                        code,
                        language,
                        typing: true // Set typing status
                    }
                }));

                // Reset typing status after delay
                setTimeout(() => {
                    setPlayersState(prev => ({
                        ...prev,
                        [playerId]: {
                            ...prev[playerId],
                            typing: false
                        }
                    }));
                }, 2000);

                // Update progress based on new code
                updatePlayerProgress(playerId, code);
            });

            // Listen for player typing status
            socket.on("playerTyping", ({ playerId }) => {
                console.log(`Player ${playerId} is typing`);
                setPlayersState(prev => ({
                    ...prev,
                    [playerId]: {
                        ...prev[playerId],
                        typing: true
                    }
                }));

                // Reset typing status after delay
                setTimeout(() => {
                    setPlayersState(prev => ({
                        ...prev,
                        [playerId]: {
                            ...prev[playerId],
                            typing: false
                        }
                    }));
                }, 2000);
            });

            // Listen for battle completion
            socket.on("battleCompleted", ({ winnerId, winnerName }) => {
                console.log("Battle completed event received:", { winnerId, winnerName });
                
                // Set winner details for modal
                setWinnerDetails({
                    winner: {
                        name: winnerName,
                        score: playersState[winnerId]?.pointsEarned || 0,
                        avatar: playersState[winnerId]?.avatar
                    },
                    loser: {
                        name: Object.entries(playersState).find(([id]) => id !== winnerId)?.[1]?.name,
                        score: Object.entries(playersState).find(([id]) => id !== winnerId)?.[1]?.pointsEarned || 0,
                        avatar: Object.entries(playersState).find(([id]) => id !== winnerId)?.[1]?.avatar
                    }
                });

                setShowWinnerModal(true);
                setBattleState(prev => ({
                    ...prev,
                    status: "completed",
                    winner: winnerId
                }));

                // Auto-navigate after 5 seconds
                setTimeout(() => {
                    navigate(`/professor/code-battle/results/${battleCode}`);
                }, 5000);
            });

            return () => {
                socket.off("codeUpdate");
                socket.off("playerTyping");
                socket.off("battleCompleted");
                socket.emit("leaveBattleRoom", battleCode);
            };
        }
    }, [socket, battleCode]);

    // Update handleBattleEnd to emit socket event
    const handleBattleEnd = async () => {
        try {
            // Check if battle is already marked as completed in localStorage
            const isCompleted = localStorage.getItem(`battle_${battleCode}_completed`);
            if (isCompleted) return;

            // Mark battle as completed in localStorage
            localStorage.setItem(`battle_${battleCode}_completed`, 'true');

            // Update battle status in the database
            await fetch(`${API_URL}/${battleCode}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'completed' })
            });

            // Calculate final scores and determine winner
            const player1Score = playersState[battle.player1.id]?.pointsEarned || 0;
            const player2Score = playersState[battle.player2.id]?.pointsEarned || 0;

            let winner, loser;
            if (player1Score > player2Score) {
                winner = battle.player1;
                loser = battle.player2;
            } else if (player2Score > player1Score) {
                winner = battle.player2;
                loser = battle.player1;
            }

            if (winner) {
                // Emit battle completion event
                socket.emit("battleComplete", {
                    battleCode,
                    winnerId: winner.id,
                    winnerName: winner.name
                });
            }

            // Set winner details and show modal
            setWinnerDetails({
                winner: winner ? {
                    name: winner.name,
                    score: winner.id === battle.player1.id ? player1Score : player2Score,
                    avatar: playersState[winner.id]?.avatar
                } : null,
                loser: loser ? {
                    name: loser.name,
                    score: loser.id === battle.player1.id ? player1Score : player2Score,
                    avatar: playersState[loser.id]?.avatar
                } : null,
                isTie: !winner && !loser
            });

            toast.success('Battle has ended!');
            setShowWinnerModal(true);
            
            setBattleState(prev => ({
                ...prev,
                status: "completed",
                winner: winner?.id
            }));

        } catch (error) {
            console.error('Error ending battle:', error);
            toast.error('Failed to end battle properly');
        }
    };

    // Fetch battle data
    useEffect(() => {
        const fetchBattleData = async () => {
            try {
                const response = await fetch(`${API_URL}/professor/${battleCode}`, {
                    credentials: 'include',
                });
                const data = await response.json();
                
                if (response.ok) {
                    setBattle(data);
                    // Initialize players state
                    setPlayersState({
                        [data.player1.id]: {
                            typing: false,
                            progress: 0,
                            code: "",
                            name: data.player1.name,
                            avatar: data.player1.avatar || Bear,
                            pointsEarned: 0
                        },
                        [data.player2.id]: {
                            typing: false,
                            progress: 0,
                            code: "",
                            name: data.player2.name,
                            avatar: data.player2.avatar || Bear,
                            pointsEarned: 0
                        }
                    });
                    setIsLoading(false);
                } else {
                    setError(data.message || 'Failed to fetch battle data');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching battle:', error);
                setError('Failed to fetch battle data');
                setIsLoading(false);
            }
        };

        fetchBattleData();
    }, [battleCode]);

    const updatePlayerProgress = (playerId, code) => {
        if (!battle) return;
        
        // Calculate total available points
        const totalPoints = battle.challenges.reduce((sum, challenge) => sum + challenge.points, 0);
        
        // Calculate points earned
        const pointsEarned = battle.challenges.reduce((sum, challenge) => {
            // Here you would implement the actual validation logic
            // This is a placeholder that you'll need to replace with actual validation
            const solved = validateTestCase(code, challenge.testCases);
            return sum + (solved ? challenge.points : 0);
        }, 0);

        // Calculate progress percentage based on points
        const progress = (pointsEarned / totalPoints) * 100;

        setPlayersState(prev => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                progress,
                code,
                pointsEarned // Add points earned to track actual points
            }
        }));
    };

    const validateTestCase = (code, test) => {
        // Implement your test case validation logic here
        // This is just a placeholder
        return false;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error || !battle) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error || "Battle not found"}</p>
                <Button onClick={() => navigate("/professor/code-battle")}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const renderPlayerCard = (playerId) => {
        const player = playersState[playerId];
        if (!player) return null;

        // Calculate total points
        const totalPoints = battle.challenges.reduce((sum, challenge) => sum + challenge.points, 0);

        return (
            <div>
                <div className="pb-6 flex justify-center align-center">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium flex items-center gap-2">
                                {player.name}
                                {player.typing && (
                                    <span className="text-xs text-blue-400 animate-pulse">
                                        typing...
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                {battle.course?.name} | {battle.course?.section}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600"></span>
                        <span className="text-sm font-medium text-purple-600">
                            {player.pointsEarned || 0}/{totalPoints} points
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-purple-600 h-full rounded-full transition-all duration-500 relative"
                            style={{ width: `${player.progress}%` }}
                        >
                            {/* Progress markers for each challenge */}
                            {battle.challenges.map((challenge, index) => {
                                const previousChallengesPoints = battle.challenges
                                    .slice(0, index)
                                    .reduce((sum, ch) => sum + ch.points, 0);
                                const markerPosition = (previousChallengesPoints + challenge.points) / totalPoints * 100;
                                
                                return (
                                    <div
                                        key={index}
                                        className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                                        style={{ 
                                            left: `${markerPosition}%`,
                                            display: markerPosition === 100 ? 'none' : 'block' // Hide the last marker
                                        }}
                                    />
                                );
                            })}
                            
                            <motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0.2, 0.5, 0.2],
                                    background: [
                                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5))",
                                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.8))",
                                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5))"
                                    ]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-md overflow-hidden relative">
                    <ProfCodeEditor 
                        onChange={(code) => updatePlayerProgress(playerId, code)}
                        readOnly={true}
                        value={player.code}
                    />
                </div>
            </div>
        );
    };

    return (
        <div>
            <style>
                {`
                    .shimmer-effect {
                        position: relative;
                        overflow: hidden;
                    }

                    .shimmer-effect::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            120deg,
                            transparent,
                            rgba(255, 255, 255, 0.6),
                            transparent
                        );
                        animation: shimmer 2s linear infinite;
                    }

                    @keyframes shimmer {
                        0% {
                            left: -100%;
                        }
                        100% {
                            left: 200%;
                        }
                    }
                `}
            </style>
            
            <main className="mt-24 px-4 w-full">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md py-4 px-4 flex flex-col md:flex-row gap-4 border-b-2 border-gray-200 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="w-full">
                        <motion.div 
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex justify-start shimmer-effect">
                                CODE BATTLE ARENA
                                <motion.div
                                    animate={{ rotate: [5, -5, 5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sword className="h-5 w-5 text-pink-400" />
                                </motion.div>
                            </h2>

                            <motion.div 
                                className="gap-2 text-sm text-black text-start"
                                animate={{ textShadow: ["0 0 10px #fff", "0 0 20px #fff", "0 0 10px #fff"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Challenge: {battle.title}
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="text-center p-2 rounded-lg border border-red-500/30"
                        >
                            <div className={`text-lg font-bold ${
                                parseInt(battleState.timer?.split(':')[0] || '0') < 5 
                                    ? 'text-red-500' 
                                    : 'text-purple-600'
                            }`}>
                                {battleState.timer || "00:00"}
                            </div>
                        </motion.div>

                        <Button 
                            disabled={true}
                            className="bg-gray-500 text-white text-sm font-bold py-6 px-4 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden"
                        >
                            {battleState.status === "completed" ? "Battle Ended" : "Battle in Progress"}
                            <div className="absolute inset-0 bg-white/20" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative text-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden"
                    >
                        {renderPlayerCard(battle.player1.id)}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden"
                    >
                        {renderPlayerCard(battle.player2.id)}
                    </motion.div>
                </div>

                {/* Challenge Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-purple-500/20 p-6 rounded-lg mt-6"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-600">
                        <Shield className="h-6 w-6 text-purple-600" />
                        Battle Challenges
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {battle.challenges.map((challenge, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                className="p-6 border rounded-lg bg-white shadow-sm"
                            >
                                <div className="space-y-4">
                                    {/* Challenge Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                {challenge.problemTitle}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {challenge.problemDescription}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {challenge.points} Points
                                        </div>
                                    </div>

                                    {/* Challenge Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                                Input Constraints
                                            </h5>
                                            {challenge.inputConstraints.map((input, idx) => (
                                                <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <code className="text-sm font-mono text-gray-800">
                                                        {input}
                                                    </code>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                                Expected Output
                                            </h5>
                                            {challenge.expectedOutput.map((output, idx) => (
                                                <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <code className="text-sm font-mono text-gray-800">
                                                        {output}
                                                    </code>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>

            {/* Winner Modal */}
            <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
                <DialogContent className="bg-[#18122B] border border-[#2B1F4A] text-[#F5F5F5] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex justify-center items-center gap-2">
                            <Trophy className="h-8 w-8 text-yellow-400" />
                            Battle Completed!
                        </DialogTitle>
                        <DialogDescription className="text-[#C2C2DD] text-lg text-center">
                            {winnerDetails?.isTie ? (
                                "The battle ended in a tie!"
                            ) : (
                                `${winnerDetails?.winner?.name} has won the battle!`
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {!winnerDetails?.isTie && (
                        <div className="space-y-4 py-4">
                            <div className="bg-[#0D0A1A] rounded-lg p-6 border border-yellow-500/30 text-center">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-center flex-1">
                                        <Avatar className="h-16 w-16 mx-auto mb-2">
                                            <AvatarImage src={winnerDetails?.winner?.avatar} />
                                            <AvatarFallback>{winnerDetails?.winner?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-yellow-400 font-bold">{winnerDetails?.winner?.name}</p>
                                        <p className="text-sm text-[#C2C2DD]">{winnerDetails?.winner?.score} points</p>
                                    </div>
                                    <div className="text-2xl font-bold text-[#C2C2DD]">VS</div>
                                    <div className="text-center flex-1">
                                        <Avatar className="h-16 w-16 mx-auto mb-2">
                                            <AvatarImage src={winnerDetails?.loser?.avatar} />
                                            <AvatarFallback>{winnerDetails?.loser?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-[#C2C2DD] font-bold">{winnerDetails?.loser?.name}</p>
                                        <p className="text-sm text-[#C2C2DD]">{winnerDetails?.loser?.score} points</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-gray-400 mt-4 text-center">
                        Redirecting to results in {Math.ceil((5000 - (Date.now() - (showWinnerModal ? Date.now() : 0))) / 1000)} seconds...
                    </div>

                    <Button 
                        onClick={() => navigate(`/professor/code-battle/results/${battleCode}`)}
                        className="w-full bg-[#B689F4] hover:bg-[#B689F4]/80 text-white mt-2"
                    >
                        View Battle Results <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CodeBattle;

