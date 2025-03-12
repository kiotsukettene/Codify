// frontend/src/components/student-view/StudentChallengesView.jsx
import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Swords } from 'lucide-react';
import challenges from '@/constants/challenges';
import StudentChallengeCard from '@/components/student-view/challenge-card';
import challengesImg from '@/assets/picture/random background/challenges.png';
import wave from '@/assets/picture/random background/wave.png';
import { useStudentStore } from '@/store/studentStore';
import { useChallengeStore } from '@/store/challengeStore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function StudentChallengesView() {
  const [challengeList, setChallengeList] = useState(challenges);
  const { student } = useStudentStore();
  const { solvedChallenges, fetchSolvedChallenges } = useChallengeStore();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        if (student?._id) {
          await fetchSolvedChallenges(student._id);
        }
      } catch (error) {
        console.error('Error fetching solved challenges:', error);
      }
    };
    fetchChallenges();
  }, [student?._id, fetchSolvedChallenges]);

  useEffect(() => {
    const updatedChallenges = challenges.map((challenge) => {
      const isSolved = solvedChallenges.some((solved) => solved.id === challenge.id);
      return {
        ...challenge,
        status: isSolved ? 'completed' : 'pending',
      };
    });
    setChallengeList(updatedChallenges);
  }, [solvedChallenges]);

  const filterChallenges = (difficulty) => {
    if (difficulty === 'all') return challengeList;
    return challengeList.filter((challenge) => challenge.difficulty.toLowerCase() === difficulty);
  };

  const completedChallenges = useMemo(() => {
    return solvedChallenges.length;
  }, [solvedChallenges]);

  const handleChallengeClick = (challengeId, status) => {
    navigate(`/student/challenges/${challengeId}`, { state: { isCompleted: status === 'completed' } });
  };

  const ChallengeCard = ({ challenges }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="w-full cursor-pointer"
          onClick={() => handleChallengeClick(challenge.id, challenge.status)}
        >
          <StudentChallengeCard
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
            tags={[challenge.difficulty]}
            status={challenge.status}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col">
          <h1 className="text-header font-semibold text-4xl mt-3">Let's warm up!</h1>
          <Tabs defaultValue="all" className="w-full mt-5">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ChallengeCard challenges={filterChallenges('all')} />
            </TabsContent>
            <TabsContent value="easy">
              <ChallengeCard challenges={filterChallenges('easy')} />
            </TabsContent>
            <TabsContent value="medium">
              <ChallengeCard challenges={filterChallenges('medium')} />
            </TabsContent>
            <TabsContent value="hard">
              <ChallengeCard challenges={filterChallenges('hard')} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col justify-between h-full bg-white p-4 rounded-xl">
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-2xl bg-[#5315BB] overflow-hidden">
              <img src={challengesImg} alt="Space Computer" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-center text-header font-semibold text-2xl">
              Crack the Code, Level Up Your Skills
            </h1>
            <h4 className="text-center text-neutral-600 text-md">
              Select a challenge and show your coding prowess
            </h4>
            <Card className="p-3 border-none shadow-none bg-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-200 rounded-lg">
                  <Swords className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Completed Challenges</p>
                  <p className="text-2xl font-bold text-primary">{completedChallenges}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="w-full aspect-square rounded-2xl overflow-hidden mt-4">
            <img src={wave || '/placeholder.svg'} alt="Wave decoration" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentChallengesView;