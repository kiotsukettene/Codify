import React, { useEffect } from "react";
import Header from "@/components/professor-view/Header";
import BattleCard from "@/components/professor-view/BattleCard";
import RankingList from "@/components/professor-view/RankingList";
import GradeTask from "@/components/professor-view/GradeTask";
import StatsCard from "@/components/professor-view/StatsCard";
import ScheduleList from "@/components/professor-view/ScheduleList";
import { UsersRound, BookOpenText, ChartLine } from "lucide-react";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useCourseStore } from "@/store/courseStore";

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
    day: "Friday",
  },
  {
    id: 2,
    subject: "Soft Eng",
    class: "BSCS 3B",
    time: "10:00am - 1:00pm",
    day: "Friday",
  },
  {
    id: 3,
    subject: "Web System",
    class: "BSCS 3B",
    time: "3:00pm - 6:00pm",
    day: "Monday",
  },
];

const ProfDashboard = ({ title, content }) => {
  const {
    professor,
    isLoading: profLoading,
    error: profError,
  } = useprofAuthStore();
  const {
    courses,
    uniqueStudentCount,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseStore();
  const professorId = professor?._id;

  useEffect(() => {
    console.log("Checking professor auth");
    useprofAuthStore.getState().checkProfAuth();
  }, []);

  useEffect(() => {
    if (professorId) {
      console.log("Fetching data for professorId:", professorId);
      useprofAuthStore.getState().fetchProfessorById(professorId);
      useCourseStore.getState().fetchCoursesByProfessor();
      useCourseStore.getState().fetchUniqueStudentCountByProfessor({
        year: "3",
        section: "B",
        program: "BSCS",
      });
    } else {
      console.warn("professorId is undefined");
    }
  }, [professorId]);

  const currentDate = new Date();
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = daysOfWeek[currentDate.getDay()];

  const todaysCourses = courses.filter(
    (course) => course.schedule?.day.toLowerCase() === currentDay
  );

  const todaysCoursesFormatted = todaysCourses.map((course, index) => ({
    id: index + 1,
    subject: course.className,
    class: `${course.program} ${course.year}${course.section}`,
    time: course.schedule.time,
    day: course.schedule.day,
  }));

  const displaySchedule =
    todaysCoursesFormatted.length > 0
      ? todaysCoursesFormatted
      : mockSchedule.filter(
          (schedule) => schedule.day.toLowerCase() === currentDay
        );

  console.log("Professor:", professor);
  console.log("Professor ID:", professorId);
  console.log("Courses:", courses);
  console.log("Today's Courses:", todaysCourses);
  console.log("Display Schedule:", displaySchedule);
  console.log("Unique Student Count:", uniqueStudentCount);
  console.log("Auth error:", profError);

  if (profError) {
    return <div>Error: {profError}</div>;
  }
  if (courseError) {
    return <div>Error fetching courses: {courseError}</div>;
  }

  const displayedCourseCount =
    profLoading || courseLoading ? "Loading..." : courses.length;
  const displayedStudentCount =
    profLoading || courseLoading ? "Loading..." : uniqueStudentCount || 0; // Fallback to 0

  return (
    <div className="w-full min-h-screen px-2 md:px-4">
      <Header ProfName={professor?.firstName ?? "Loading..."} />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="space-y-6 md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <StatsCard
              title="Total Students"
              value={displayedStudentCount}
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
          <BattleCard />
        </div>
        <ScheduleList scheduleData={displaySchedule} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <RankingList rankingData={mockStudentRankings} />
        <GradeTask activityData={mockToGradeTasks} />
      </div>
    </div>
  );
};

export default ProfDashboard;
