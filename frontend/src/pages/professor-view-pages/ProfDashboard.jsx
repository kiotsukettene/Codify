import Hearder from "@/components/professor-view/Header";
import BattleCard from "@/components/professor-view/BattleCard";
import RankingList from "@/components/professor-view/RankingList";
import GradeTask from "@/components/professor-view/GradeTask";
import StatsCard from "@/components/professor-view/StatsCard";
import ScheduleList from "@/components/professor-view/ScheduleList";
import { UsersRound, BookOpenText, ChartLine } from "lucide-react";

const mockStudentRankings = [
  {
    id: 1,
    name: "Irheil Mae S. Antang",
    section: "BSCS 3B",
    score: 98,
    rank: 1,
    avatar: "👨‍🎓",
  },
  {
    id: 2,
    name: "Momo Lopez",
    section: "BSCS 3B",
    score: 95,
    rank: 2,
    avatar: "👩‍🎓",
  },
  {
    id: 3,
    name: "Milo Dog",
    section: "BSCS 3B",
    score: 92,
    rank: 3,
    avatar: "👨‍🎓",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    section: "BSCS 3B",
    score: 90,
    rank: 4,
    avatar: "👩‍🎓",
  },
  {
    id: 5,
    name: "Mike Brown",
    section: "BSCS 3B",
    score: 88,
    rank: 5,
    avatar: "👨‍🎓",
  },
];

const mockToGradeTasks = [
  {
    id: 1,
    studentName: "John Smith",
    assignment: "JavaScript Basics",
    dueDate: "2024-03-20",
    status: "Pending",
  },
  {
    id: 2,
    studentName: "Maria Garcia",
    assignment: "React Components",
    dueDate: "2024-03-21",
    status: "Pending",
  },
  {
    id: 3,
    studentName: "Alex Wong",
    assignment: "API Integration",
    dueDate: "2024-03-19",
    status: "Overdue",
  },
];

const mockSchedule = [
  {
    id: 1,
    subject: "Software Engineering",
    class: "BSCS 3A",
    time: "7:00am - 10:00am",
  },
  {
    id: 2,
    subject: "Soft Eng",
    class: "BSCS 3B",
    time: "10:00am - 1:00pm",
  },
  {
    id: 3,
    subject: "Web System",
    class: "BSCS 3B",
    time: "3:00pm - 6:00pm",
  },
];

const ProfDashboard = () => {
  return (
    <div className="w-full min-h-screen px-4 md:px-6 overflow-hidden">
      {/* Header */}
      <Hearder />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Left Section: Stats Cards and Battle Card */}
        <div className="space-y-6 md:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <StatsCard
              title="Total Students"
              value="150"
              icon={<UsersRound size={24} />}
            />
            <StatsCard
              title="Total Courses"
              value="4"
              icon={<BookOpenText size={24} />}
            />
            <StatsCard
              title="Grading Queue"
              value="67"
              icon={<ChartLine size={24} />}
            />
          </div>

          {/* Battle Card */}
          <BattleCard />
        </div>

        {/* Today's Schedule */}
        <div className="bg-white border border-black/5 p-6 rounded-lg shadow-sm text-left w-full md:col-span-2">
          <ScheduleList scheduleData={mockSchedule} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Rankings */}
        <RankingList rankingData={mockStudentRankings} />

        {/* To-Grade Tasks */}
        <GradeTask activityData={mockToGradeTasks} />
      </div>
    </div>
  );
};

export default ProfDashboard;
