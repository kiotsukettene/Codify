import { useState, useEffect } from "react";
import { Rocket, Clock, ArrowLeft, CheckCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStudentStore } from "@/store/studentStore";
import { toast } from "react-hot-toast";

export default function StudentBattleLobby() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { student } = useStudentStore();

  const [battle, setBattle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [playerPositions, setPlayerPositions] = useState({
    currentPlayer: null,
    opponent: null,
    isCurrentPlayerCommander: false
  });

  useEffect(() => {
    const fetchBattleData = async () => {
      if (!battleId || !student?._id) {
        setError("Invalid battle ID or not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching battle data for:", {
          battleId,
          currentStudentId: student._id
        });
        
        const response = await axios.get(`http://localhost:3000/api/battles/${battleId}`, {
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
          currentStudentId: currentStudentId
        });

        // Check if current student is player1 or player2
        const isPlayer1 = (battleData.player1?.id || battleData.player1) === currentStudentId;
        const isPlayer2 = (battleData.player2?.id || battleData.player2) === currentStudentId;

        console.log("Player check result:", {
          isPlayer1,
          isPlayer2,
          currentStudentId
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
          isCurrentPlayerCommander: isPlayer1 // player1 is always Commander
        });

        // Check if the current user is already ready
        const joinedPlayers = battleData.joinedPlayers || [];
        const isPlayerReady = joinedPlayers.some(id => id === currentStudentId);
        setIsReady(isPlayerReady);

      } catch (error) {
        console.error("Error fetching battle data:", error);
        setError("Failed to load battle data.");
      }
      setIsLoading(false);
    };

    fetchBattleData();
  }, [battleId, student?._id]);

  const handleReadyClick = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/battles/join/${battleId}`,
        {},
        { withCredentials: true }
      );
      
      setIsReady(true);
      toast.success("You're ready for battle!");

      // Refetch battle data to update status
      const response = await axios.get(`http://localhost:3000/api/battles/${battleId}`, {
        withCredentials: true,
      });
      setBattle(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to mark as ready";
      setError(errorMessage);
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
            {battle.courseId?.name || "Programming Languages"} | {battle.program} {battle.section}
          </p>
        </div>

        {/* Player Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Player Card */}
          <div className={`p-6 rounded-lg border ${isReady ? "border-green-500/50 bg-[#1A1625]/50" : "border-purple-800/50 bg-[#1A1625]/50"}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${isReady ? "bg-green-500" : "bg-yellow-500"} border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {playerPositions.isCurrentPlayerCommander ? "Commander" : "Pilot"} {playerPositions.currentPlayer?.name}
                  </h3>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">You</Badge>
                </div>
                <Badge className={`mt-1 ${isReady ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
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
                <div className={`h-full transition-all duration-300 ${isReady ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"}`}></div>
              </div>
              {!isReady ? (
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
          <div className="p-6 rounded-lg border border-purple-800/50 bg-[#1A1625]/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white"></div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "bg-green-500" : "bg-yellow-500"} border-2 border-[#1A1625]`}></div>
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {!playerPositions.isCurrentPlayerCommander ? "Commander" : "Pilot"} {playerPositions.opponent?.name}
                </h3>
                <Badge className={`mt-1 ${battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "Systems Online" : "Awaiting Launch"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mission Status:</span>
                <span className={battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "text-green-400" : "text-yellow-400"}>
                  {battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "Ready for Launch" : "Preparing Systems"}
                </span>
              </div>
              <div className="h-2 bg-[#0D0A1A] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"}`}></div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {battle.joinedPlayers?.includes(playerPositions.opponent?._id) ? "Player is ready for battle" : "Waiting for player to get ready..."}
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
            {battle.description || "Prepare for an interstellar coding challenge! You'll face algorithmic puzzles that will test your problem-solving skills. Work quickly and efficiently to outperform your opponent."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-700 min-w-[200px] transition-colors"
            disabled={!isReady || battle.joinedPlayers?.length !== 2}
          >
            <Rocket className="h-5 w-5 mr-2" />
            LAUNCH SEQUENCE
          </Button>
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
  );
}