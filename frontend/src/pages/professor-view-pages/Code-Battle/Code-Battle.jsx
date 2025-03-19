import React, {useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Flame, Sword, Shield } from "lucide-react"
import ProfCodeEditor from '@/components/Prof-Code-Editor'
import { motion, AnimatePresence } from "framer-motion"
import Bear from "@/assets/picture/Avatar/Bear.png"

// First, let's add these configurations at the top of the file, outside the component
const BATTLE_CONFIG = {
  defaultTime: "15:00",
  countdown: {
    sequence: [3, 2, 1, "LET THE CODING BATTLE BEGIN!"],
    duration: 1000 // 1 second per count
  },
  statuses: {
    waiting: { color: "bg-yellow-500", label: "Waiting" },
    active: { color: "bg-red-500", label: "In Progress" },
    finished: { color: "bg-green-500", label: "Finished" }
  }
}

const CHALLENGE_DATA = {
  title: "Array Manipulation",
  category: "Programming Languages",
  class: "BSCS 3B",
  description: "Implement a function that manipulates arrays efficiently"
}

const PLAYERS_DATA = [
  {
    id: 1,
    name: "Irheil Mae Antang",
    avatar: Bear,
    initials: "IM",
    role: "Player 1"
  },
  {
    id: 2,
    name: "Momo Revillame",
    avatar: Bear,
    initials: "MR",
    role: "Player 2"
  }
]

const TEST_CASES = [
    { input: "[1,2,3]", expected: "[3,2,1]", solved: false },
    { input: "[5,10,15]", expected: "[15,10,5]", solved: false },
    { input: "[7,8,9]", expected: "[9,8,7]", solved: false }
];

const CodeBattle = () => {
    const [battleState, setBattleState] = useState({
        timer: BATTLE_CONFIG.defaultTime,
        status: "waiting",
        showCountdown: false,
        winner: null
    })

    const [playersState, setPlayersState] = useState(
        PLAYERS_DATA.reduce((acc, player) => ({
            ...acc,
            [player.id]: {
                typing: false,
                progress: 20,
                code: ""
            }
        }), {})
    )

    const [countdownNumber, setCountdownNumber] = useState(3);
    const [testCases, setTestCases] = useState(TEST_CASES);


        {/* FOR TIMER */}   

    useEffect(() => {
        let interval;
        if (battleState.status === "active" && battleState.timer !== "00:00") {
            interval = setInterval(() => {
                setBattleState(prev => {
                    const [mins, secs] = prev.timer.split(":").map(Number);
                    let totalSeconds = mins * 60 + secs - 1;
                    
                    if (totalSeconds < 0) {
                        return { ...prev, status: "finished", timer: "00:00" };
                    }

                    const newMins = Math.floor(totalSeconds / 60);
                    const newSecs = totalSeconds % 60;
                    return {
                        ...prev,
                        timer: `${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`
                    };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [battleState.status]);

        {/* FOR COUNTDOWN */}   

    const startBattle = () => {
        setBattleState(prev => ({ ...prev, showCountdown: true }));
        let countIndex = 0;
        
        const countdownInterval = setInterval(() => {
            if (countIndex < BATTLE_CONFIG.countdown.sequence.length - 1) {
                setCountdownNumber(BATTLE_CONFIG.countdown.sequence[countIndex + 1]);
                countIndex++;
            } else {
                clearInterval(countdownInterval);
                setBattleState(prev => ({
                    ...prev,
                    showCountdown: false,
                    status: "active"
                }));
            }
        }, BATTLE_CONFIG.countdown.duration);
    }

    const updatePlayerProgress = (playerId, code) => {
        const solvedTests = testCases.filter(test => validateTestCase(code, test)).length;
        const progress = (solvedTests / testCases.length) * 100;

        setPlayersState(prev => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                progress,
                code
            }
        }));
    }

    const renderPlayerCard = (player) => (
        <div>
            <div className="pb-6 flex justify-center align-center ">
                <div className="flex items-center gap-2">
                {battleState.winner === player.id && (
                                <Trophy className="h-6 w-6 text-yellow-500" />
                            )}
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {player.role} : {player.name}
                           
                        </div>
                        <div className="text-xs text-gray-500">
                            {CHALLENGE_DATA.category} | {CHALLENGE_DATA.class}
                        </div>
                    </div>
                </div>
            </div>
            

            <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${playersState[player.id].progress}%` }}
                >
                    {playersState[player.id].progress > 0 && (
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
                    )}
                </div>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden relative">
                <ProfCodeEditor 
                    onChange={(code) => updatePlayerProgress(player.id, code)} 
                />
            </div>
        </div>
    )

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
            
            {/* Countdown Overlay */}
            <AnimatePresence>
                {battleState.showCountdown && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            key={countdownNumber} 
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`font-bold text-white ${
                                typeof countdownNumber === 'number' 
                                    ? 'text-8xl' 
                                    : 'text-4xl'
                            }`}
                        >
                            {countdownNumber}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
         
            <main className="mt-24 px-4 w-full"> {/* Add padding-top equal to header height */}
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
                                <motion.div
                                    animate={{ rotate: [-5, 5, -5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                </motion.div>
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
                                Challenge: {CHALLENGE_DATA.title}
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="text-center p-2 rounded-lg border border-red-500/30"
                        >
                            {/* <div className="text-xs text-purple-600">Timer:</div> */}
                            <div className={`text-lg font-bold ${parseInt(battleState.timer.split(':')[0]) < 5 ? 'text-red-500' : 'text-purple-600'}`}>
                                {battleState.timer}
                            </div>
                        </motion.div>

                        <Button 
                            onClick={startBattle} 
                            disabled={battleState.status === "active"}
                            className={`${
                                battleState.status === "active" 
                                    ? 'bg-gray-500' 
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                            } text-white text-sm font-bold py-6 px-4 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden`}
                        >
                            {battleState.status === "active" ? 'Battle in Progress' : 'Start Battle'}
                            <div
                                className="absolute inset-0 bg-white/20"
                            />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative text-black ">
                    {PLAYERS_DATA.map(player => (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden"
                        >
                            {renderPlayerCard(player)}
                        </motion.div>
                    ))}
                </div>

                {/* Test Cases Section */}

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-purple-500/20 p-6 rounded-lg mt-6"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-600">
                        <Shield className="h-6 w-6 text-purple-600" />
                        Battle Challenges
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {testCases.map((test, index) => (
                            <motion.div
                                key={index}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 border rounded-lg`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-purple-600">
                                        Challenge {index + 1}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 rounded-md border border-purple-500/20">
                                        <p className="text-sm text-gray-300">
                                            <span className="font-mono text-purple-900">Input:</span>
                                            <span className="font-mono ml-2 text-black">{test.input}</span>
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-md border border-purple-500/20">
                                        <p className="text-sm text-gray-300">
                                            <span className="font-mono text-purple-900">Expected:</span>
                                            <span className="font-mono ml-2 text-black">{test.expected}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

export default CodeBattle
