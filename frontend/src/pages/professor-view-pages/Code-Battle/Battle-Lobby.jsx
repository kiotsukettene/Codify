import React, { useEffect, useState, useContext } from 'react';
import { Rocket, Clock, ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams, useNavigate } from 'react-router-dom';
import useBattleStore from '@/store/battleStore';
import toast from 'react-hot-toast';
import { SocketContext } from '@/context/auth-context/SocketProvider';

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

    socket.on('playerJoined', ({ userId }) => {
      const playerKey = userId === battle.player1.id ? 'player1' : 'player2';
      setPlayers((prev) => ({
        ...prev,
        [playerKey]: { ...prev[playerKey], joined: true, ready: true },
      }));
      toast.success(`${userId === battle.player1.id ? battle.player1.name : battle.player2.name} has joined!`);
    });

    socket.on('playerReady', ({ userId }) => {
      const playerKey = userId === battle.player1.id ? 'player1' : 'player2';
      setPlayers((prev) => ({
        ...prev,
        [playerKey]: { ...prev[playerKey], ready: true },
      }));
      toast.success(`${userId === battle.player1.id ? battle.player1.name : battle.player2.name} is ready!`);

      const updatedPlayers = {
        ...players,
        [playerKey]: { joined: true, ready: true },
      };
      if (updatedPlayers.player1.ready && updatedPlayers.player2.ready) {
        setBattleStatus('started');
        socket.emit('battleStart', { battleCode });
        toast.success('All players ready! Battle starting...');
        localStorage.removeItem(`battleTimer_${battleCode}`);
        navigate(`/professor/code-battle/arena/${battleCode}`);
      }
    });

    return () => {
      socket.off('playerJoined');
      socket.off('playerReady');
    };
  }, [socket, battle, battleCode, players, navigate]);

  const formatTime = (seconds) => {
    if (seconds === null) return 'Loading...';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartBattle = () => {
    if (players.player1.joined && players.player2.joined) {
      setBattleStatus('started');
      socket.emit('battleStart', { battleCode });
      localStorage.removeItem(`battleTimer_${battleCode}`);
      navigate(`/professor/code-battle/arena/${battleCode}`);
    } else {
      toast.error('Both players must join before starting the battle');
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
          <div className={`p-6 rounded-lg border ${players.player1.joined ? "border-green-500/50 bg-[#1A1625]/50" : "border-purple-800/50 bg-[#1A1625]/50"}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${players.player1.joined ? "bg-green-500" : "bg-yellow-500"} border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    Commander {battle.player1.name}
                  </h3>
                </div>
                <Badge className={`mt-1 ${players.player1.joined ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {players.player1.joined ? "Systems Online" : "Awaiting Launch"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={players.player1.joined ? "text-green-400" : "text-yellow-400"}>
                  {players.player1.joined ? "Ready for Launch" : "Preparing Systems"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${players.player1.joined ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"}`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {players.player1.joined ? "Player is ready for battle" : "Waiting for player to get ready..."}
              </div>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className={`p-6 rounded-lg border ${players.player2.joined ? "border-green-500/50 bg-[#1A1625]/50" : "border-purple-800/50 bg-[#1A1625]/50"}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${players.player2.joined ? "bg-green-500" : "bg-yellow-500"} border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    Pilot {battle.player2.name}
                  </h3>
                </div>
                <Badge className={`mt-1 ${players.player2.joined ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {players.player2.joined ? "Systems Online" : "Awaiting Launch"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={players.player2.joined ? "text-green-400" : "text-yellow-400"}>
                  {players.player2.joined ? "Ready for Launch" : "Preparing Systems"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${players.player2.joined ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"}`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {players.player2.joined ? "Player is ready for battle" : "Waiting for player to get ready..."}
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
            disabled={!players.player1.joined || !players.player2.joined || battleStatus !== 'waiting'}
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
    </div>
  );
};

export default BattleLobby;