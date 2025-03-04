import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import challengesImg from "@/assets/picture/random background/challenges.png";
import wave from "@/assets/picture/random background/wave.png";

import React, { useMemo } from "react";
import { Swords } from "lucide-react";
import StudentChallengeCard from "@/components/student-view/challenge-card";

function StudentChallengesView() {
  const challengesSample= [
    {
      id: 1,
      title: "Two sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      lessons: 18,
      tags:[ "easy"],
      status: "completed",
    },
    {
      id: 2,
      title: "Array list",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      lessons: 2,
      tags: ["medium"],
      status: "completed",
    },
    // Duplicate the second course 6 more times to fill the grid
    ...Array(2).fill({
      id: Math.random(),
      title: "Creating Awesome Mobile Apps",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      lessons: 2,
      tags: ["hard"],
      status: "pending",
    }),
  ];

  const challengesSamples = useMemo(() => challengesSample, [challengesSample])

   // ===================Filter challenges based on difficulty===================
   const filterChallenges = (difficulty) => {
    if (difficulty === "all") return challengesSamples
    return challengesSamples.filter((challenge) => challenge.tags.includes(difficulty.toLowerCase()))
  }

  //======================= Calculate completed challenges========================
  const completedChallenges = useMemo(() => {
    return challengesSamples.filter((challenge) => challenge.status === "completed").length
  }, [challengesSamples])

   // =========================Render challenge card==============================
   const ChallengeCard = ({ challenges }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full ">
      {challenges.map((challenge, index) => (
        <div key={challenge.id || index} className="w-full">
          <StudentChallengeCard
            title={challenge.title}
            description={challenge.description}
            tags={challenge.tags || []}
            status={challenge.status}
          />
        </div>
      ))}
    </div>
  );
  

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* <!--================== Left Side================ --> */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-header font-semibold text-4xl mt-3">Let's warm up!</h1>

          <Tabs defaultValue="all" className="w-full mt-5 ">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
            <ChallengeCard challenges={filterChallenges("all")} />
            </TabsContent>

            <TabsContent value="easy">
              <ChallengeCard challenges={filterChallenges("easy")}/>
            </TabsContent>

            <TabsContent value="medium">
              <ChallengeCard challenges={filterChallenges("medium")}/>
            </TabsContent>

            <TabsContent value="hard">
              <ChallengeCard challenges={filterChallenges("hard")}/>
            </TabsContent>
          </Tabs>
         

      
        </div>

        {/* ============================
              // Calendar & Summary
              ============================ */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col justify-between h-full bg-white p-4 rounded-xl ">
          <div className="space-y-4">
            {/* Space Computer Image */}
            <div className="w-full aspect-square rounded-2xl bg-[#5315BB] overflow-hidden">
              <img
                src={challengesImg}
                alt="Space Computer"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-center text-header font-semibold text-2xl">
              {" "}
              Crack the Code, Level Up Your Skills{" "}
            </h1>
            <h4 className="text-center text-neutral-600 text-md">
              Select a challenge and show your coding prowess
            </h4>

            {/* Total Tasks */}
            <Card className="p-3 border-none shadow-none bg-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-200 rounded-lg">
                  <Swords className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    Completed Challenges
                  </p>
                  <p className="text-2xl font-bold text-primary">{completedChallenges}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Wave Image */}
          <div className="w-full aspect-square rounded-2xl overflow-hidden mt-4">
            <img
              src={wave || "/placeholder.svg"}
              alt="Wave decoration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentChallengesView;
