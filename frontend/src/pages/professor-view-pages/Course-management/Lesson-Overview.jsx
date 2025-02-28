import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/professor-view/Sidebar";
import { Eye, FileText, Trophy, Users, Crown } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLessonStore } from "@/store/lessonStore";
import { useActivityStore } from "@/store/activityStore";
import { toast } from "react-hot-toast";

const LessonOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { lessons, isLoading, fetchLessonsByCourse } = useLessonStore(); // Use lessonStore to get lessons, loading state, and the fetch function
  const { activities, fetchActivitiesByCourse, error } = useActivityStore(); // Use activityStore to get activities, loading state, and the fetch function
  const location = useLocation();
  const courseData = location.state?.course || {}; // Get course details from navigation state
  const lessonId = activities.length > 0 ? activities[0].lessonId : null;

  const CourseDetails = ({ courseId }) => {
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
      const fetchCourseData = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          const data = await response.json();

          setCourseData(data);
        } catch (error) {
          console.error("Error fetching course:", error);
        }
      };

      fetchCourseData();
    }, [courseId]);

    if (!courseData) return <p>Loading course details...</p>;

    return (
      <div>
        <h2>
          Instructor: {courseData.professorId?.firstName}{" "}
          {courseData.professorId?.lastName}
        </h2>
      </div>
    );
  };

  // Fetch lessons for the given courseId when the component mounts or courseId changes
  useEffect(() => {
    if (!courseId) {
      console.error("Error: Course ID is undefined");
      toast.error("Invalid Course ID");
      return;
    }

    // Validate that courseId is a valid ObjectId before calling API
    if (!/^[0-9a-fA-F]{24}$/.test(courseId)) {
      console.error("Error: Invalid Course ID format", courseId);
      toast.error("Invalid Course ID format");
      return;
    }

    fetchLessonsByCourse(courseId);
  }, [courseId, fetchLessonsByCourse]);

  //fetch activities for the given courseId when the component mounts or courseId changes

  useEffect(() => {
    if (courseId) {
      fetchActivitiesByCourse(courseId).then((data) => {});
    }
  }, [courseId, fetchActivitiesByCourse]);

  const studentList = [
    {
      id: 1,
      name: "Antang, Irheil Mae S.",
      avatar: "/placeholder.svg?height=40&width=40",
      crown: "gold",
      studentNo: "20221183-N",
      email: "ayrelmay@gmail.com",
      grade: 100,
    },
    {
      id: 2,
      name: "Bae, Cathy C.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Canada, Nana S.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Elton, Monica D.",
      avatar: "/placeholder.svg?height=40&width=40",
      crown: "gold",
    },
    {
      id: 5,
      name: "Faranas, Paul O.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Gulo, Monica S.",
      avatar: "/placeholder.svg?height=40&width=40",
      crown: "silver",
    },
  ];

  const metrics = [
    {
      title: "Class Performance",
      value: "90%",
      subtitle: "Average Score",
    },
    {
      title: "Completion Rate",
      value: "80%",
      subtitle: "Activities Completed",
    },
    {
      title: "Active Students",
      value: "38/40",
      subtitle: "Currently Active",
    },
    {
      title: "Top Performers",
      value: "6",
      subtitle: "Above 15%",
    },
  ];

  const students = [
    {
      name: "Antang, Irheil Mae S.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "IA",
      rank: 1,
      activities: 15,
      incomplete: 0,
      totalScore: 1500,
      hasMedal: true,
    },
    {
      name: "Antang, Paul Cyrus S.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PA",
      rank: 2,
      activities: 15,
      incomplete: 1,
      totalScore: 1400,
      hasMedal: true,
    },
    {
      name: "Sison, Razel Mae",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
      rank: 3,
      activities: 15,
      incomplete: 2,
      totalScore: 1300,
      hasMedal: true,
    },
    {
      name: "Abelong, Eugene",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AE",
      rank: 4,
      activities: 15,
      incomplete: 3,
      totalScore: 1200,
      hasMedal: false,
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <motion.div
        className="flex flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SidebarInset className="flex-1 !p-0">
          <header className="flex h-16 items-center px-4">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Separator orientation="vertical" className="mx-2 h-4" />
          </header>

          {/* MAIN CONTENT */}

          <div className="p-2 sm:p-8 pt-2 space-y-4 sm:space-y-6">
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
              title={courseData.className}
              description={courseData.program}
              details={{
                language: courseData.language,
                students: "40 Students", // Update dynamically if available
                instructor: courseData?.professorId
                  ? `${courseData.professorId?.firstName ?? "Unknown"} ${
                      courseData.professorId?.lastName ?? ""
                    }`
                  : "Unknown Instructor",
                schedule: courseData.schedule
                  ? `${courseData.schedule.day}, ${courseData.schedule.time}`
                  : "No schedule available",
                courseCode: courseData.courseCode,
                section: courseData.section,
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
                        <motion.div
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
                        <Crown className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute -top-1 -right-1" />
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
                      <OverviewTab
                        lessons={lessons || []}
                        course={courseData}
                      />
                    )}

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
                          activity={activity} // ✅ Pass only a single activity, not the entire array
                          courseId={courseId}
                          lessonId={lessonId} // ✅ Use activity's lessonId instead of global lessonId
                        />
                      </motion.div>
                    ))}

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
        </SidebarInset>
      </motion.div>
    </SidebarProvider>
  );
};

export default LessonOverview;
