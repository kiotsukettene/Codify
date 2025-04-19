import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords, Timer, Users, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Bear from "@/assets/picture/Avatar/Bear.png";
import { useParams } from 'react-router-dom';
import useBattleStore from '@/store/battleStore';

const BattleLobby = () => {
  const { battleId } = useParams();
  const { battles, fetchBattles } = useBattleStore();
  const [battle, setBattle] = useState(null);
  const [players, setPlayers] = useState({
    player1: { joined: false, ready: false },
    player2: { joined: false, ready: false }
  });
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  useEffect(() => {
    if (battles.length > 0) {
      const currentBattle = battles.find(b => b.id === battleId);
      if (currentBattle) {
        setBattle(currentBattle);
      }
    }
  }, [battles, battleId]);

  useEffect(() => {
    // Simulated player joining - replace with actual WebSocket logic
    const timer1 = setTimeout(() => {
      setPlayers(prev => ({
        ...prev,
        player1: { ...prev.player1, joined: true }
      }));
    }, 2000);

    const timer2 = setTimeout(() => {
      setPlayers(prev => ({
        ...prev,
        player2: { ...prev.player2, joined: true }
      }));
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PlayerCard = ({ player, isJoined, isReady, position }) => (
    <motion.div
      initial={{ x: position === 'left' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`relative p-6 rounded-lg border-2 ${
        isJoined ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={Bear}
            alt="Player avatar"
            className={`w-16 h-16 rounded-full ${!isJoined && 'opacity-50 grayscale'}`}
          />
          {isJoined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </motion.div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">{player.name}</h3>
          <p className={`text-sm ${isJoined ? 'text-green-600' : 'text-gray-500'}`}>
            {isJoined ? 'Connected' : 'Waiting...'}
          </p>
        </div>
      </div>
      {isJoined && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mt-4"
        >
          <Progress value={isReady ? 100 : 0} className="h-2" />
        </motion.div>
      )}
    </motion.div>
  );

  if (!battle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8 flex items-center justify-center">
        <p className="text-purple-600">Loading battle details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            <h1 className="text-3xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <Swords className="h-8 w-8" />
              Battle Lobby
              <Crown className="h-8 w-8 text-yellow-500" />
            </h1>
          </motion.div>
          <p className="text-purple-600 mt-2">Waiting for challengers to join...</p>
        </div>

        <Card className="p-6 mb-8 bg-white/80 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-700">
                <Shield className="h-5 w-5" />
                <h2 className="font-semibold">Battle Details</h2>
              </div>
              <p className="text-lg font-bold">{battle.challenge}</p>
              <p className="text-sm text-gray-600">{battle.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-700">
                <Timer className="h-5 w-5" />
                <h2 className="font-semibold">Time Until Start</h2>
              </div>
              <div className="text-2xl font-mono font-bold text-purple-800">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PlayerCard
            player={battle.challengers[0]}
            isJoined={players.player1.joined}
            isReady={players.player1.ready}
            position="left"
          />
          <PlayerCard
            player={battle.challengers[1]}
            isJoined={players.player2.joined}
            isReady={players.player2.ready}
            position="right"
          />
        </div>

        <motion.div
          className="text-center"
          animate={{
            opacity: [0.5, 1, 0.5],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          <p className="text-purple-600 text-sm">
            Battle will begin automatically when both players are ready
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BattleLobby;

