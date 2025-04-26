import React, { useState, useEffect } from "react";
import Logo from "@/assets/picture/logos/Logo.png";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import LiveNowBG from "@/assets/picture/random-background/LiveNow-BG.png";
import { Cover } from "@/components/ui/cover";
import { Calendar, Clock, ArrowRight, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JoinBattleModal from "@/components/student-view/join-battle-modal";
import NotificationCard from "@/components/student-view/notification-card";
import useBattleStore from "@/store/battleStore";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ArenaDashboardPage = () => {
  const navigate = useNavigate();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { fetchStudentBattles } = useBattleStore();
  const [battles, setBattles] = useState({
    upcoming: [],
    lobby: [],
    active: [],
    completed: []
  });



  useEffect(() => {
    const loadBattles = async () => {
      try {
        const battlesData = await fetchStudentBattles();
        const categorizedBattles = battlesData.reduce((acc, battle) => {
          if (battle.status === "completed") {
            acc.completed.push(battle);
          } else if (battle.status === "active") {
            acc.active.push(battle);
          } else if (battle.status === "lobby") {
            acc.lobby.push(battle);
          } else if (battle.status === "pending") {
            acc.upcoming.push(battle);
          }
          return acc;
        }, { upcoming: [], lobby: [], active: [], completed: [] });

        setBattles(categorizedBattles);
      } catch (error) {
        console.error("Error loading battles:", error);
      }
    };

    loadBattles();
  }, [fetchStudentBattles]);

  const cards = [
    {
      id: 1,
      title: "Upcoming Battles",
      description: "Join the next coding challenges and prepare your skills",
      color: "from-red-500 to-red-600",
      tagText: "NEW",
      count: battles.upcoming.length + battles.lobby.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total of Battles",
      description: "All coding battles completed",
      color: "from-indigo-500 to-indigo-600",
      tagText: "STATS",
      count: battles.completed.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const activeBattles = battles.active.map(battle => ({
    id: battle.id,
    name: battle.challenge,
    subject: `${battle.course?.program} | ${battle.course?.section}`,
    description: battle.description,
    accent: "purple-500",
    battleCode: battle.battleCode,
    status: battle.status,
    commencement: battle.commencement
  }));

  console.log(battles)

  const handleJoinActiveBattle = (battleCode) => {
    navigate(`/student/code-battle/lobby/${battleCode}`);
  };

  return (
    <div className="min-h-screen bg-[#151135] text-white p-6 px-7">
      <div className="flex justify-between items-center mb-8">
        <img src={Logo} alt="" />
        <div className="flex items-center gap-4">
          <NotificationCard />
          <Button onClick={() => navigate("/student/code-battle")}>
            Back to Home
          </Button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl mb-8">
          <div className="p-8">
            <p className="md:text-4xl lg:text-6xl font-semibold space-y-4 text-white leading-tight z-20 py-6 md:py-6 bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Step Into the Arena and <Cover>Prove Your Skills!</Cover>
            </p>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              Compete against other coders in real-time coding battles. Enter
              your unique battle code to join and showcase your problem-solving
              skills
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative p-6 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg w-full`}
            >
              <div className="absolute top-4 left-4 flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {card.icon}
                <span className="ml-1">{card.tagText}</span>
              </div>
              <h3 className="text-3xl font-bold mt-8">{card.title}</h3>
              <p className="text-5xl font-extrabold mt-2">{card.count}</p>
              <p className="mt-2 text-white/80 text-lg">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Incoming Battles (Lobby) Section */}
        {battles.lobby.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="h-6 w-6 text-purple-400" />
              Incoming Battles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {battles.lobby.map((battle) => (
                <Card 
                  key={battle.id} 
                  className="group bg-[#1A1625] border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-purple-500/20 text-purple-400 px-2 py-1">{battle.status.toUpperCase()}</Badge>
                          <Badge variant="outline" className="bg-transparent border-purple-500/30 text-purple-400/80 px-2">
                            {battle.challenge}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{battle.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{battle.description}</p>
                      </div>
                    </div>

                    <Separator className="my-4 bg-purple-500/20" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span>Starts: {format(new Date(battle.commencement), "MMM dd, yyyy - h:mm a")}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-purple-400 font-medium">Battle Code:</span>
                            <code className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-sm">
                              {battle.id}
                            </code>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setIsJoinModalOpen(true)}
                          className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40"
                        >
                          Join Battle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Battles Section */}
        {battles.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-400" />
              Upcoming Battles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {battles.upcoming.map((battle) => (
                <Card key={battle.id} className="bg-[#1A1625] border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{battle.title}</h3>
                        <p className="text-gray-400 text-sm">{battle.description}</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Scheduled</Badge>
                    </div>
                    <Separator className="my-4 bg-purple-500/20" />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(battle.commencement), "MMM dd, yyyy - h:mm a")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Live Battles Section */}
        {battles.active.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Live now</h2>
            <InfiniteSlider durationOnHover={75} gap={24}>
              {activeBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="w-[250px] h-[200px] rounded-lg p-4 flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  style={{ backgroundImage: `url(${LiveNowBG})` }}
                  onClick={() => handleJoinActiveBattle(battle.battleCode)}
                >
                  <div className="absolute inset-0 bg-black/70 rounded-lg"></div>
                  <div className="relative flex flex-col items-center text-white">
                    <h3 className="mt-3 text-lg font-bold">{battle.name}</h3>
                    <p className="text-sm text-white/80 text-center">{battle.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <p className="text-sm text-green-400">Live Now</p>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteSlider>
          </div>
        )}

        <JoinBattleModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ArenaDashboardPage;