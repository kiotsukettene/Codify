import React, { useState, useEffect } from "react";
import Hearder from "@/components/professor-view/Header";
import BattleCard from "@/components/professor-view/BattleCard";
import RankingList from "@/components/professor-view/RankingList";
import GradeTask from "@/components/professor-view/GradeTask";
import StatsCard from "@/components/professor-view/StatsCard";
import ScheduleList from "@/components/professor-view/ScheduleList";
import { UsersRound, BookOpenText, ChartLine } from "lucide-react";
import { useprofAuthStore } from "@/store/profAuthStore";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { courseCount, isLoading, professorId } = useprofAuthStore();

  useEffect(() => {
    if (professorId) {
      useprofAuthStore.getState().fetchProfessorById(professorId);
    }
  }, [professorId]);

  const displayedCourseCount = isLoading ? "Loading..." : courseCount ?? 0;

  return (
<div className="w-full min-h-screen px-2 md:px-4">
      {/* Header */}
      <Hearder />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {/* Left Section: Stats Cards and Battle Card */}
              <div className="space-y-6 md:col-span-2 lg:col-span-3">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  <StatsCard
                    title="Total Students"
                    value="0"
                    icon={<UsersRound size={24} />}
                  />
                  <StatsCard
                    title="Total Courses"
                    value={displayedCourseCount}
                    icon={<BookOpenText size={24} />}
                  />
                  <StatsCard
                    title="Grading Queue"
                    value="0"
                    icon={<ChartLine size={24} />}
                  />
                </div>

                {/* Battle Card */}
                <BattleCard />
              </div>

              {/* Today's Schedule - Remains beside the stats & battle card */}
                  <ScheduleList scheduleData={mockSchedule} />
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
