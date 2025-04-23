import React, { useEffect, useState } from "react";
import Header from "@/components/professor-view/Header";
import BattleCard from "@/components/professor-view/BattleCard";
import RankingList from "@/components/professor-view/RankingList";
import GradeTask from "@/components/professor-view/GradeTask";
import StatsCard from "@/components/professor-view/StatsCard";
import ScheduleList from "@/components/professor-view/ScheduleList";
import { UsersRound, BookOpenText, ChartLine } from "lucide-react";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useCourseStore } from "@/store/courseStore";
import { useActivityStore } from "@/store/activityStore";
import { useStudentStore } from "@/store/studentStore";

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
  const { fetchActivitiesByCourse, fetchSubmissionsByActivity } =
    useActivityStore();
  const { fetchStudents } = useStudentStore();
  const [gradingQueueCount, setGradingQueueCount] = useState(0);
  const [toGradeTasks, setToGradeTasks] = useState([]);
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

  useEffect(() => {
    const fetchGradingQueue = async () => {
      if (!courses || courses.length === 0) return;

      let totalUnscored = 0;
      const tasks = [];
      let students = [];

      // Fetch all students to map studentId to names
      try {
        await fetchStudents();
        students = useStudentStore.getState().students;
      } catch (error) {
        console.error("Error fetching students:", error);
        return;
      }

      for (const course of courses) {
        const courseId = course._id;
        const activities = await fetchActivitiesByCourse(courseId);
        for (const activity of activities) {
          const submissions = await fetchSubmissionsByActivity(activity._id);
          const unscoredSubmissions = submissions.filter(
            (submission) => submission.score === 0
          );
          totalUnscored += unscoredSubmissions.length;

          unscoredSubmissions.forEach((submission) => {
            const student = students.find(
              (s) => s._id === submission.studentId.toString()
            );
            const dueDate = new Date(activity.dueDate);
            const currentDate = new Date();
            const status = dueDate < currentDate ? "Overdue" : "Pending";

            tasks.push({
              id: submission._id,
              studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "Unknown Student",
              assignment: activity.title,
              dueDate: dueDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
              status,
            });
          });
        }
      }
      setGradingQueueCount(totalUnscored);
      setToGradeTasks(tasks);
    };

    fetchGradingQueue();
  }, [
    courses,
    fetchActivitiesByCourse,
    fetchSubmissionsByActivity,
    fetchStudents,
  ]);

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
  console.log("Display Schedule:", displaySchedule);
  console.log("Unique Student Count:", uniqueStudentCount);
  console.log("Auth error:", profError);
  console.log("Grading Queue Count:", gradingQueueCount);
  console.log("To Grade Tasks:", toGradeTasks);

  if (profError) {
    return <div>Error: {profError}</div>;
  }
  if (courseError) {
    return <div>Error fetching courses: {courseError}</div>;
  }

  const displayedCourseCount =
    profLoading || courseLoading ? "Loading..." : courses.length;
  const displayedStudentCount =
    profLoading || courseLoading ? "Loading..." : uniqueStudentCount || 0;

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
              value={gradingQueueCount}
              icon={<ChartLine size={24} />}
            />
          </div>
          <BattleCard />
        </div>
        <ScheduleList scheduleData={displaySchedule} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <RankingList rankingData={mockStudentRankings} />
        <GradeTask activityData={toGradeTasks} />
      </div>
    </div>
  );
};

export default ProfDashboard;
