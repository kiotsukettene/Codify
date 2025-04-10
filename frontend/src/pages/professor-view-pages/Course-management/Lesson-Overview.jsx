import React, { useState, useEffect } from "react";
import { Eye, FileText, Trophy, Users, Rocket } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLessonStore } from "@/store/lessonStore";
import { useActivityStore } from "@/store/activityStore";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useCourseStore } from "@/store/courseStore";
import CourseHeader from "@/components/professor-view/Course-header";
import OverviewTab from "@/components/professor-view/Overview-Tab";
import ActivityTab from "@/components/professor-view/Activity-Tab";
import ScoreTab from "@/components/professor-view/Score-Tab";
import StudentTab from "@/components/professor-view/Student-Tab";

const tabs = [
  { id: "overview", label: "Overview", icon: <Eye className="w-4 h-4" /> },
  { id: "activities", label: "Activities", icon: <FileText className="w-4 h-4" /> },
  { id: "scores", label: "Scores", icon: <Trophy className="w-4 h-4" /> },
  { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
];

const LessonOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { courseSlug } = useParams();
  const { courses, course, fetchCourseById, fetchCoursesByProfessor, isLoading, error } = useCourseStore();
  const { activities, fetchActivitiesByCourse } = useActivityStore();
  const { lessons, fetchLessonsByCourse } = useLessonStore();
  const { professor } = useprofAuthStore();

  useEffect(() => {
    if (courses.length === 0) {
      fetchCoursesByProfessor();
    }
  }, [courses, fetchCoursesByProfessor]);

  const currentCourse = courses.find((course) => course.slug === courseSlug);
  const courseId = currentCourse?._id;

  useEffect(() => {
    if (courseId) {
      console.log("Fetching course with ID:", courseId);
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);

  useEffect(() => {
    if (courseId) {
      fetchLessonsByCourse(courseId);
      fetchActivitiesByCourse(courseId);
    }
  }, [courseId, fetchLessonsByCourse, fetchActivitiesByCourse]);

  const studentList = course?.studentsEnrolled?.map((student, index) => ({
    id: student._id || index + 1,
    name: `${student.firstName} ${student.lastName}`,
    avatar: "/placeholder.svg?height=40&width=40",
    crown: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : null,
    studentNo: student.studentId || "N/A",
    email: student.email || "N/A",
    grade: 0,
  })) || [];

  // Map activities to their corresponding lesson slugs
  const filteredActivities = activities
    .filter((activity) => lessons.some((lesson) => lesson._id === activity.lessonId))
    .map((activity) => {
      const lesson = lessons.find((lesson) => lesson._id === activity.lessonId);
      return {
        ...activity,
        lessonSlug: lesson ? lesson.slug : null,
      };
    })
    .filter((activity) => activity.lessonSlug); // Ensure only activities with a valid lessonSlug are included

  const metrics = [
    { title: "Class Performance", value: "0%", subtitle: "Average Score" },
    { title: "Completion Rate", value: "0%", subtitle: "Activities Completed" },
    { title: "Active Students", value: studentList.length.toString(), subtitle: "Currently Active" },
    { title: "Top Performers", value: "0", subtitle: "Display Performance" },
  ];

  if (isLoading && !course) return <div>Loading course...</div>;
  if (error) {
    console.error("Course fetch error:", error);
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-2 sm:space-y-4 w-full">
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
        title={course?.className || currentCourse?.className || "Loading..."}
        description={course?.program || currentCourse?.program}
        details={{
          language: course?.language || currentCourse?.language,
          students: course?.studentCount
            ? `${course.studentCount} student${course.studentCount === 1 ? "" : "s"}`
            : currentCourse?.studentCount
            ? `${currentCourse.studentCount} student${currentCourse.studentCount === 1 ? "" : "s"}`
            : "0 students",
          instructor: professor
            ? `${professor.firstName} ${professor.lastName}`
            : "Unknown Instructor",
          schedule: course?.schedule || currentCourse?.schedule
            ? `${course?.schedule?.day || currentCourse?.schedule?.day}, ${course?.schedule?.time || currentCourse?.schedule?.time}`
            : "No schedule available",
          code: course?.courseCode || currentCourse?.courseCode,
          section: course?.section || currentCourse?.section,
        }}
      />

      <div className="w-full">
        <div className="border-b mb-6 overflow-x-hidden">
          <div className="flex gap-1 sm:gap-2 min-w-[600px]">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-sm font-medium rounded-t-lg transition-colors relative
                  ${activeTab === tab.id ? "bg-violet-100 text-violet-600" : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-violet-100 rounded-t-lg -z-10"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
                {React.cloneElement(tab.icon, { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                {tab.label}
                {activeTab === tab.id && (
                  <Rocket className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute-right-1" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <OverviewTab lessons={lessons || []} course={course || currentCourse} />
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
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity, index) => (
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
                            courseSlug={courseSlug} // Pass courseSlug
                            lessonSlug={activity.lessonSlug} // Pass the mapped lessonSlug
                          />
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500">No activities available for this course.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
              {activeTab === "scores" && (
                <ScoreTab metrics={metrics} students={studentList} />
              )}
              {activeTab === "students" && (
                <StudentTab studentList={studentList} activities={activities} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LessonOverview;