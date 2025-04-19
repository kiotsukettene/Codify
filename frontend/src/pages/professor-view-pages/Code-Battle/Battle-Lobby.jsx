import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords, Timer, Users, Crown, Rocket, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Bear from '@/assets/picture/Avatar/Bear.png';
import { useParams, useNavigate } from 'react-router-dom';
import useBattleStore from '@/store/battleStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const LOBBY_WAIT_TIME = 300; // 5 minutes in seconds

const BattleLobby = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { battles, fetchBattles } = useBattleStore();
  const [battle, setBattle] = useState(null);
  const [players, setPlayers] = useState({
    player1: { joined: false, ready: false },
    player2: { joined: false, ready: false },
  });
  const [timeLeft, setTimeLeft] = useState(LOBBY_WAIT_TIME);
  const [battleStatus, setBattleStatus] = useState('waiting'); // waiting, started, completed
  const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

  // Fetch battles and set up battle data
  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  // Find and set the current battle
  useEffect(() => {
    if (battles.length > 0) {
      const currentBattle = battles.find((b) => b.id === battleId);
      if (currentBattle) {
        setBattle(currentBattle);
      } else {
        toast.error('Battle not found');
        navigate('/professor/code-battle');
      }
    }
  }, [battles, battleId, navigate]);

  // Timer logic for lobby waiting period
  useEffect(() => {
    if (timeLeft <= 0) return;

    // Start timer only when at least one player has joined
    if (!players.player1.joined && !players.player2.joined) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // If both players are ready, start the battle
          if (players.player1.ready && players.player2.ready) {
            setBattleStatus('started');
            socket.emit('battleStart', { battleId });
            toast.success('Battle is starting!');
            navigate(`/professor/code-battle/arena/${battleId}`);
          } else {
            // If time runs out and players aren't ready
            setBattleStatus('completed');
            socket.emit('battleCancelled', { battleId });
            toast.error('Battle cancelled - players not ready in time');
            navigate('/professor/code-battle');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, players, battleId, socket, navigate]);

  // Socket.io listeners for real-time updates
  useEffect(() => {
    socket.on('playerJoined', ({ userId }) => {
      setPlayers((prev) => ({
        ...prev,
        [userId === battle?.challengers[0]?.id ? 'player1' : 'player2']: {
          ...prev[userId === battle?.challengers[0]?.id ? 'player1' : 'player2'],
          joined: true,
        },
      }));
      toast.success(`${userId === battle?.challengers[0]?.id ? battle?.challengers[0]?.name : battle?.challengers[1]?.name} has joined!`);
    });

    socket.on('playerReady', ({ userId }) => {
      setPlayers((prev) => ({
        ...prev,
        [userId === battle?.challengers[0]?.id ? 'player1' : 'player2']: {
          ...prev[userId === battle?.challengers[0]?.id ? 'player1' : 'player2'],
          ready: true,
        },
      }));
      toast.success(`${userId === battle?.challengers[0]?.id ? battle?.challengers[0]?.name : battle?.challengers[1]?.name} is ready!`);

      // Check if both players are ready
      const updatedPlayers = {
        ...players,
        [userId === battle?.challengers[0]?.id ? 'player1' : 'player2']: { joined: true, ready: true },
      };
      if (updatedPlayers.player1.ready && updatedPlayers.player2.ready) {
        setBattleStatus('started');
        socket.emit('battleStart', { battleId });
        toast.success('All players ready! Battle starting...');
        navigate(`/professor/code-battle/arena/${battleId}`);
      }
    });

    return () => {
      socket.off('playerJoined');
      socket.off('playerReady');
    };
  }, [socket, battle, battleId, players, navigate]);

  const formatTime = (seconds) => {
    if (seconds === null) return 'Loading...';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!battle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 p-8 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity },
          }}
          className="text-violet-600"
        >
          <Rocket className="h-12 w-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/path/to/your/gaming-background.jpg')] bg-cover bg-center opacity-10" />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl w-full mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-4 mb-4">
              <Swords className="h-12 w-12 text-yellow-400" />
              Code Arena
              <Crown className="h-10 w-10 text-yellow-400" />
            </h1>
          </motion.div>
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-200 text-xl font-medium"
          >
            {battleStatus === 'waiting' ? 'Waiting for players to join...' : battleStatus === 'started' ? 'Epic Battle in Progress!' : 'Battle Concluded!'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Battle Details</h2>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{battle?.challenge}</h3>
            <p className="text-purple-200 text-lg">{battle?.description}</p>
            <p className="text-purple-300 text-sm mt-2">Course: {battle?.course?.name}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Timer className="h-6 w-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Lobby Timer</h2>
            </div>
            <motion.div
              animate={{
                scale: timeLeft < 60 ? [1, 1.1, 1] : 1,
                color: timeLeft < 60 ? ['#ffffff', '#ff0000', '#ffffff'] : '#ffffff',
              }}
              transition={{ duration: 1, repeat: timeLeft < 60 ? Infinity : 0 }}
              className="text-5xl font-mono font-bold text-center"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <p className="text-purple-200 text-sm text-center mt-2">
              {!players.player1.joined && !players.player2.joined
                ? "Waiting for players to join..."
                : !players.player1.ready || !players.player2.ready
                ? "Players must be ready before time runs out!"
                : "All players ready!"}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="relative"
            >
              <div
                className={`
                  p-8 rounded-2xl backdrop-blur-lg border-2 transition-all duration-300
                  ${players[`player${index + 1}`].joined ? 'border-purple-400 bg-purple-400/10' : 'border-gray-500/30 bg-white/5'}
                  transform hover:scale-105
                  ${index === 0 ? 'hover:rotate-[-1deg]' : 'hover:rotate-[1deg]'}
                `}
              >
                <motion.div
                  animate={{
                    boxShadow: players[`player${index + 1}`].joined ? ['0 0 0px purple', '0 0 30px purple', '0 0 0px purple'] : 'none',
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-6"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: players[`player${index + 1}`].joined ? 360 : 0 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <img
                        src={Bear}
                        alt="Player avatar"
                        className={`w-20 h-20 rounded-full ${!players[`player${index + 1}`].joined && 'opacity-50 grayscale'}`}
                      />
                    </motion.div>
                    {players[`player${index + 1}`].joined && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5"
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <motion.h3
                      animate={{ color: players[`player${index + 1}`].joined ? '#ffffff' : '#9CA3AF' }}
                      className="text-2xl font-bold mb-2"
                    >
                      {battle?.challengers[index]?.name || 'Unknown'}
                    </motion.h3>
                    <motion.p
                      animate={{
                        color: players[`player${index + 1}`].joined ? '#A5B4FC' : '#6B7280',
                        scale: players[`player${index + 1}`].joined ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-lg"
                    >
                      {players[`player${index + 1}`].joined ? 'Ready for Battle!' : 'Awaiting Champion...'}
                    </motion.p>
                  </div>
                </motion.div>

                {players[`player${index + 1}`].joined && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="mt-6"
                  >
                    <Progress value={players[`player${index + 1}`].ready ? 100 : 0} className="h-2" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-purple-200 text-xl font-semibold">
            {battleStatus === 'waiting'
              ? 'The Epic Battle Begins Soon!'
              : battleStatus === 'started'
              ? 'The Epic Battle Begins When Both Champions Are Ready'
              : 'Battle Concluded! Check Results.'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BattleLobby;