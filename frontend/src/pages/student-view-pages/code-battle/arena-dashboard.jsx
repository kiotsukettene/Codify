import React, { useState } from "react";
import Logo from "@/assets/picture/logos/Logo.png";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import LiveNowBG from "@/assets/picture/random-background/LiveNow-BG.png";
import { Cover } from "@/components/ui/cover";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JoinBattleModal from "@/components/student-view/join-battle-modal";
import NotificationCard from "@/components/student-view/notification-card";

const ArenaDashboardPage = () => {
  const navigate = useNavigate();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Upcoming Battles",
      description: "Join the next coding challenges and prepare your skills",
      color: "from-red-500 to-red-600",
      tagText: "NEW",
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
      count: "42",
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
      graphic: (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-green-400 bg-opacity-30 absolute -top-8 right-4"></div>
            <div className="w-12 h-12 rounded-full bg-green-300 bg-opacity-40 absolute top-4 right-0"></div>
            <div className="w-14 h-14 rounded-full bg-green-200 bg-opacity-50 absolute top-2 -right-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const professors = [
    {
      id: 1,
      name: "Dr. Smith",
      subject: "Computer Science",
      description:
        "Explore algorithms, data structures, and programming fundamentals",
      accent: "purple-500",
    },
    {
      id: 2,
      name: "Prof. Johnson",
      subject: "Mathematics",
      description: "Explore calculus, algebra, and statistical analysis",
      accent: "red-500",
    },
    {
      id: 3,
      name: "Dr. Williams",
      subject: "Physics",
      description: "Explore mechanics, quantum theory, and relativity",
      accent: "pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#151135] text-white p-6 px-7">
      <div className="flex justify-between items-center">
        <img src={Logo} alt="" />
        <div className="flex items-center gap-4">
          <NotificationCard />
          <Button onClick={() => navigate("/student/code-battle")}>
            Back to Home
          </Button>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto items-center flex justify-center">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl">
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
      </div>

      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
              {card.id === 1 && (
                <p className="mt-4 text-md font-medium bg-white/20 text-white px-3 py-2 rounded-md flex gap-2 items-center">
                  <Calendar /> Schedule: March 20, 2025 - 3:00 PM
                </p>
              )}
              {card.id === 1 && (
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="mt-4 w-full bg-white text-neutral-900 font-semibold px-5 py-3 rounded-lg hover:bg-white/30 transition-all"
                >
                  Join Battle
                </button>
              )}
              {card.id === 2 && (
                <button className="mt-4 w-full bg-white/20 text-white font-semibold px-5 py-3 rounded-lg hover:bg-white/30 transition-all">
                  View History
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-6 rounded-lg">
        <h2 className="text-4xl font-bold text-white mb-6">Live now</h2>
        <InfiniteSlider durationOnHover={75} gap={24}>
          {professors.map((prof) => (
            <div
              key={prof.id}
              className="w-[250px] h-[200px] rounded-lg p-4 flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden shadow-lg hover:scale-105 transition-transform"
              style={{
                backgroundImage: `url(${LiveNowBG})`,
              }}
            >
              <div className="absolute inset-0 bg-black/70 rounded-lg"></div>
              <div className="relative flex flex-col items-center text-white">
                <div className="text-4xl drop-shadow-lg">{prof.icon}</div>
                <h3 className="mt-3 text-lg font-bold">{prof.name}</h3>
                <p className="text-sm text-white/80">{prof.subject}</p>
                <p className="mt-2 px-3 py-1 text-sm bg-green-500/90 text-white font-semibold rounded-full shadow-lg">
                  Live Now
                </p>
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>

      <JoinBattleModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default ArenaDashboardPage;