"use client"

import Typewriter from "@/components/fancy/typewriter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityIcon, BookHeart, LibraryBig, NotebookTabs, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import dashboardImage from "@/assets/picture/random-background/dashboard-img.png"
import spaceShip from "@/assets/picture/random-background/dashboard-spaceShip.png"
import { useStudentStore } from "@/store/studentStore"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import useStudentCourseStore from "@/store/studentCourseStore"
import { useActivityStore } from "@/store/activityStore"
import ScheduleModal from "@/components/student-view/schedule-modal"
import { motion } from "framer-motion"
function StudentDashboard() {
  const navigate = useNavigate()
  const { student } = useStudentStore()
  const { enrolledCourses, fetchEnrolledCourses } = useStudentCourseStore()
  const { activities, fetchStudentAllActivities } = useActivityStore()
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStudentAllActivities()
      console.log("Fetched all activities:", data) // Debug log
    }
    fetchData()
  }, [fetchStudentAllActivities])

  const studentName = student ? student.firstName : "Student"

  useEffect(() => {
    fetchEnrolledCourses()
  }, [fetchEnrolledCourses])
  console.log("Enrolled Courses:", enrolledCourses) // Debugging line

  // Get current date
  // Get current day of the week
  const currentDate = new Date()
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const currentDay = daysOfWeek[currentDate.getDay()] // e.g., "tuesday" for April 08, 2025

  // Filter enrolledCourses for the current day of the week
  const todaysCourses = enrolledCourses.filter((course) => course.schedule?.day.toLowerCase() === currentDay)

  console.log("Today's Courses:", todaysCourses) // Debugging lang

    
  function formatHour(time) {
    if (!time) return "Time TBD";
    
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
  
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }
  

  return (
    <div className="flex flex-col mx-6">
      {/* ✅ Greeting Section at the Top */}

      <div className="w-full flex flex-col items-start justify-start px-4 pt-6">
        <p className="text-2xl text-foreground dark:text-muted font-normal leading-tight">
          <span className="block">Hi, {studentName} 🌞</span> {/* ✅ Display student name */}
          <Typewriter
            text={[
              "Welcome to Codify",
              "Manage your platform easily!",
              "Let's keep things organized!",
              "Keep shining 🌟",
              "Stay on top of everything!",
            ]}
            speed={70}
            className="text-primary font-semibold"
            waitTime={1500}
            deleteSpeed={40}
            cursorChar={"_"}
          />
        </p>
      </div>

      <motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: "easeOut" }}
className="pb-10"
>
      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left Side Content */}
        <div className="w-full lg:w-[65%] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-min">
            {/* Total Course Cards */}
            <Card className="w-full h-40 rounded-xl bg-pink-50 border-0 shadow-none px-4">
              <CardHeader className="pt-7">
                <CardTitle className="text-lg font-medium text-gray-500">Total Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-pink-500">All</p>
                    <h1 className=" text-4xl text-neutral-900 font-semibold">{enrolledCourses.length}</h1>
                  </div>
                  <LibraryBig color="#FF62A4" className="w-12 h-12" />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full h-40 rounded-xl bg-blue-50 border-0 shadow-none px-4">
              <CardHeader className="pt-7">
                <CardTitle className="text-lg font-medium text-gray-500">Total Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-pink-500">All</p>
                    <h1 className="text-4xl text-neutral-900 font-semibold">{activities.length}</h1>
                  </div>
                  <ActivityIcon color="#FF62A4" className="w-12 h-12" />
                </div>
              </CardContent>
            </Card>

            {/* Task Section */}
            <div className="col-span-1 md:col-span-2 h-72 w-full rounded-xl bg-violet-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900">Check up your current and upcoming task here</h1>
                <Button
                  className="bg-primary rounded-full px-20 py-6 mt-5 text-white"
                  onClick={() => navigate("/student/task-list")}
                >
                  View Task
                </Button>
              </div>
              <img
                src={dashboardImage || "/placeholder.svg"}
                className="hidden lg:block w-80 h-80"
                alt="Task Illustration"
              />
            </div>
          </div>

          {/* My Courses Section */}
          <div className="pt-8">
            <div className="flex justify-between w-full">
              <h1 className="text-3xl font-semibold text-gray-900">My Courses</h1>
              <Button
                variant="link"
                onClick={() => navigate("/student/course-list")}
                className="text-primary font-medium"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {enrolledCourses.map((course, index) => (
                <div key={index} className="rounded-lg w-auto h-32 bg-white flex justify-start items-center gap-4 px-8">
                  <h1 className="w-24 h-24 bg-violet-100 rounded-lg font-medium text-4xl flex justify-center items-center">
                    {course.className?.substring(0, 2).toUpperCase() || "NA"}
                  </h1>
                  <div>
                    <h1 className="font-semibold">{course.className || "Unnamed Course"}</h1>
                    <div className="flex space-x-8">
                      <div className="flex items-center gap-2">
                        <NotebookTabs color="#C2A6DE" />
                        <p className="text-sm text-neutral-800">{course.lessonCount || 0} Lessons</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy color="#C2A6DE" />
                        <p className="text-sm text-neutral-800">{course.status || "In Progress"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {enrolledCourses.length === 0 && (
                <div className="text-gray-500  text-center  px-auto space-x-2 mt-5  flex flex-col h-full justify-center items-center bg-white">
                  <BookHeart className="w-9 h-9" />
                  <p className=" text-lg">No enrolled courses yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="w-full lg:w-[35%] p-4">
          {/* UPDATED SECTION: Upcoming Class Today with Modal */}
          <div className="bg-white rounded-lg p-6 relative overflow-hidden">
            {/* Decorative elements for gamified look */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mt-16 -mr-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -mb-12 -ml-12 opacity-50"></div>

            <div className="flex justify-between relative z-10">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <Trophy className="w-4 h-4 text-purple-600" />
                </span>
                Upcoming Class Today
              </h2>
              <Button
                variant="link"
                className="text-primary font-normal hover:text-primary/80 relative group"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                See All
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Button>
            </div>

            <div className="h-[500px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4 relative z-10">
              {todaysCourses.length > 0 ? (
                todaysCourses.map((course, index) => (
                  <div
                    key={index}
                    className={`${
                      course.bgColor || "bg-blue-50"
                    } rounded-xl p-4 hover:translate-x-1 cursor-pointer transition-all duration-300 hover:shadow-md relative overflow-hidden group`}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mt-8 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`${
                            course.color || "bg-blue-500"
                          } w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transform group-hover:scale-110 transition-transform duration-300`}
                        >
                          {course.initials || course.className?.substring(0, 2).toUpperCase() || "NA"}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{course.className || "Unnamed Course"}</h3>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span>{course.schedule?.day || "Day TBD"}</span>
                            <span className="mx-2">•</span>
                            <span>{formatHour(course.schedule?.time || "Time TBD")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress indicator that appears on hover */}
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center px-auto space-x-2 flex flex-col h-full justify-center items-center">
                  <div className="relative">
                    <BookHeart className="w-12 h-12 text-purple-300" />
                    <div className="absolute inset-0 animate-ping opacity-30">
                      <BookHeart className="w-12 h-12 text-purple-300" />
                    </div>
                  </div>
                  <p className="text-lg mt-4">No classes scheduled for today</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-dashed border-purple-300 text-purple-500 hover:bg-purple-50"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    View All Schedules
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Modal */}
          <ScheduleModal
            open={isScheduleModalOpen}
            onOpenChange={setIsScheduleModalOpen}
            allCourses={enrolledCourses}
          />

          {/* Additional Info Section */}
          <div className="bg-white rounded-lg p-6 mt-4">
            <div className="flex">
              <img src={spaceShip || "/placeholder.svg"} className="w-56 h-52" alt="Space Ship" />
              <div className="p-4">
                <h1 className="text-2xl font-semibold text-gray-900">Ready to take off?</h1>
                <p className="text-sm text-gray-600">
                  Explore the galaxy of coding and take your skills to the next level
                </p>
                <Button
                  className="bg-primary rounded-full px-5 py-2 mt-3 text-white"
                  onClick={() => navigate("/student/challenges")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

export default StudentDashboard
