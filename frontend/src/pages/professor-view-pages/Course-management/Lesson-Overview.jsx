import React, { useState, useEffect } from "react";
import { Eye, FileText, Trophy, Users, Rocket } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CourseHeader from "@/components/professor-view/Course-header";
import OverviewTab from "@/components/professor-view/Overview-Tab";
import ActivityTab from "@/components/professor-view/Activity-Tab";
import ScoreTab from "@/components/professor-view/Score-Tab";
import StudentTab from "@/components/professor-view/Student-Tab";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLessonStore } from "@/store/lessonStore";
import { useActivityStore } from "@/store/activityStore";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useCourseStore } from "@/store/courseStore";

const studentList = [
  {
    id: 1,
    name: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    crown: "gold",
    studentNo: "20221183-N",
    email: "none",
    grade: 0,
  },
];

const metrics = [
  {
    title: "Class Performance",
    value: "0%",
    subtitle: "Average Score",
  },
  {
    title: "Completion Rate",
    value: "0%",
    subtitle: "Activities Completed",
  },
  {
    title: "Active Students",
    value: "0",
    subtitle: "Currently Active",
  },
  {
    title: "Top Performers",
    value: "0",
    subtitle: "Display Performance",
  },
];

const students = [
  {
    name: "Student 1",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "S",
    rank: 0,
    activities: 0,
    incomplete: 0,
    totalScore: 0,
    hasMedal: true,
  },
];

const tabs = [
  { id: "overview", label: "Overview", icon: <Eye className="w-4 h-4" /> },
  {
    id: "activities",
    label: "Activities",
    icon: <FileText className="w-4 h-4" />,
  },
  { id: "scores", label: "Scores", icon: <Trophy className="w-4 h-4" /> },
  { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
];

const LessonOverview = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  //BE
  const { courseSlug, lessonSlug } = useParams();

  const { courses, course, fetchCourseById, fetchCoursesByProfessor } =
    useCourseStore();
  const { activities, fetchActivitiesByCourse } = useActivityStore();
  const { lessons, fetchLessonsByCourse } = useLessonStore();
  const lessonIds = lessons.map((lesson) => lesson._id);

  const { professor } = useprofAuthStore();

  // Fetch courses if not already loaded
  useEffect(() => {
    if (courses.length === 0) {
      fetchCoursesByProfessor();
    }
  }, [courses, fetchCoursesByProfessor]);

  const currentCourse = courses.find((course) => course.slug === courseSlug);
  const courseId = currentCourse?._id;

  useEffect(() => {
    console.log("Current course matching slug:", currentCourse);
  }, [currentCourse]);

  // Fetch lessons once courseId is available
  useEffect(() => {
    if (courseId) {
      fetchLessonsByCourse(courseId);
    }
  }, [courseId, fetchLessonsByCourse]);

  // In the parent component (LessonOverview), before mapping:
  const filteredActivities = activities.filter((activity) =>
    lessonIds.includes(activity.lessonId)
  );

  //fetch activities for the given courseId when the component mounts or courseId changes
  useEffect(() => {
    if (courseId) {
      fetchActivitiesByCourse(courseId).then((data) => {});
    }
  }, [courseId, fetchActivitiesByCourse]);

  return (
    
    <div className="p-2 sm:p-8 pt-2 space-y-4 sm:space-y-6 w-full">
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/professor/course">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Lesson</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <CourseHeader
      title={currentCourse?.className || "Loading..."}
      description={currentCourse?.program}
      details={{
        language: currentCourse?.language,
        //
        students: currentCourse?.studentCount
          ? `${currentCourse.studentCount} student${
              currentCourse.studentCount === 1 ? "" : "s"
            }`
          : "0 students",
        instructor: professor
          ? `${professor.firstName} ${professor.lastName}`
          : "Unknown Instructor", // Fetch from local storage
        schedule: currentCourse?.schedule
          ? `${currentCourse?.schedule.day}, ${currentCourse?.schedule.time}`
          : "No schedule available",
        courseCode: currentCourse?.courseCode,
        section: currentCourse?.section,

      }}
    />

    <div className="w-full">
      {/* Enhanced Tabs */}
      <div className="border-b mb-6 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2 min-w-[600px]">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-lg transition-colors relative
      ${
        activeTab === tab.id
          ? "bg-violet-100 text-violet-600"
          : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"
      }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {activeTab === tab.id && (
                <motion.divc
                  className="absolute inset-0 bg-violet-100 rounded-t-lg -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
              {React.cloneElement(tab.icon, {
                className: "w-3 h-3 sm:w-4 sm:h-4",
              })}
              {tab.label}
              {activeTab === tab.id && (
                <Rocket className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute-right-1" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && (
              <OverviewTab lessons={lessons || []} course={course} />
            )}

            {activeTab === "activities" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="activities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-4"
                    >
                      <ActivityTab
                        index={index + 1}
                        activity={activity}
                        courseId={courseSlug}
                        lessonIds={lessonSlug}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {activeTab === "scores" && (
              <ScoreTab metrics={metrics} students={students} />
            )}

            {activeTab === "students" && (
              <StudentTab
                studentList={studentList}
                activities={activities}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
 
  );
};

export default LessonOverview;