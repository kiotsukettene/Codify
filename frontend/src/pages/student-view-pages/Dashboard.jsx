import Typewriter from "@/components/fancy/typewriter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ActivityIcon,
  ChartNoAxesColumnIncreasing,
  LibraryBig,
  NotebookTabs,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardImage from "@/assets/picture/random-background/dashboard-img.png";
import StudentHeader from "@/components/student-view/Header";
import spaceShip from "@/assets/picture/random-background/dashboard-spaceShip.png";
import { useStudentStore } from "@/store/studentStore";
import { useNavigate } from "react-router-dom";
import { useActivityStore } from "../../store/activityStore";

function StudentDashboard() {
  const navigate = useNavigate();
  const { student } = useStudentStore();
  const { activities, fetchStudentAllActivities } = useActivityStore();
  const studentName = student ? student.firstName : "Student";
  const classes = [
    {
      initials: "SE",
      name: "Software Engineering",
      date: "October 10, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      initials: "WTS",
      name: "Web System and Technologies",
      date: "October 15, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      initials: "NAC",
      name: "Networks and Communication",
      date: "October 30, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      initials: "SF",
      name: "System Fundamentals",
      date: "November 10, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-red-400",
      bgColor: "bg-red-50",
    },
    {
      initials: "DB",
      name: "Database Systems",
      date: "November 15, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      initials: "AI",
      name: "Artificial Intelligence",
      date: "November 20, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ];
  return (
    <div className="flex flex-col mx-6">
      {/* ✅ Greeting Section at the Top */}

      <div className="w-full flex flex-col items-start justify-start px-4 pt-6">
        <p className="text-2xl text-foreground dark:text-muted font-normal leading-tight">
          <span className="block">Hi, {studentName} 🌞</span>{" "}
          {/* ✅ Display student name */}
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

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left Side Content */}
        <div className="w-full lg:w-[65%] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-min">
            {/* Total Course Cards */}
            <Card className="w-full h-40 rounded-xl bg-pink-50 border-0 shadow-none px-4">
              <CardHeader className="pt-7">
                <CardTitle className="text-lg font-medium text-gray-500">
                  Total Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-pink-500">All</p>
                    <h1 className=" text-4xl text-neutral-900 font-semibold">
                      12
                    </h1>
                  </div>
                  <LibraryBig color="#FF62A4" className="w-12 h-12" />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full h-40 rounded-xl bg-blue-50 border-0 shadow-none px-4">
              <CardHeader className="pt-7">
                <CardTitle className="text-lg font-medium text-gray-500">
                  Total Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-pink-500">All</p>
                    <h1 className="text-4xl text-neutral-900 font-semibold">
                      {activities.length}
                    </h1>
                  </div>
                  <ActivityIcon color="#FF62A4" className="w-12 h-12" />
                </div>
              </CardContent>
            </Card>

            {/* Task Section */}
            <div className="col-span-1 md:col-span-2 h-72 w-full rounded-xl bg-violet-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900">
                  Check up your current and upcoming task here
                </h1>
                <Button
                  className="bg-primary rounded-full px-20 py-6 mt-5 text-white"
                  onClick={() => navigate("/student/task-list")}
                >
                  View Task
                </Button>
              </div>
              <img
                src={dashboardImage}
                className="hidden lg:block w-80 h-80"
                alt="Task Illustration"
              />
            </div>
          </div>

          {/* My Courses Section */}
          <div className="pt-8">
            <div className="flex justify-between w-full">
              <h1 className="text-3xl font-semibold text-gray-900">
                My Courses
              </h1>
              <Button
                variant="link"
                onClick={() => navigate("/student/course-list")}
                className="text-primary font-medium"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {/* Course Cards */}
              <div className="rounded-lg w-auto h-32 bg-white flex justify-start items-center gap-4 px-8">
                <h1 className="w-24 h-24 bg-violet-100 rounded-lg font-medium text-4xl flex justify-center items-center">
                  SE
                </h1>
                <div>
                  <h1 className="font-semibold">Software Engineering</h1>
                  <div className="flex space-x-8">
                    <div className="flex items-center gap-2">
                      <NotebookTabs color="#C2A6DE" />
                      <p className="text-sm text-neutral-800">12 Lessons</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy color="#C2A6DE" />
                      <p className="text-sm text-neutral-800">Average</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg w-auto h-32 bg-white flex justify-start items-center gap-4 px-8">
                <h1 className="w-24 h-24 bg-violet-100 rounded-lg font-medium text-4xl flex justify-center items-center">
                  SE
                </h1>
                <div>
                  <h1 className="font-semibold">Software Engineering</h1>
                  <div className="flex space-x-8">
                    <div className="flex items-center gap-2">
                      <NotebookTabs color="#C2A6DE" />
                      <p className="text-sm text-neutral-800">12 Lessons</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy color="#C2A6DE" />
                      <p className="text-sm text-neutral-800">Average</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="w-full lg:w-[35%] p-4">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Class
              </h2>
              <Button variant="link" className="text-primary font-normal">
                See All
              </Button>
            </div>
            <div className="h-[500px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {classes.map((classItem, index) => (
                <div
                  key={index}
                  className={`${classItem.bgColor} rounded-xl p-4 hover:translate-x-1 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`${classItem.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}
                      >
                        {classItem.initials}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {classItem.name}
                        </h3>
                        <div className="text-sm text-gray-500 flex items-center">
                          <span>{classItem.date}</span>
                          <span className="mx-2">•</span>
                          <span>{classItem.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white rounded-lg p-6 mt-4">
            <div className="flex">
              <img src={spaceShip} className="w-56 h-52" alt="Space Ship" />
              <div className="p-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Ready to take off?
                </h1>
                <p className="text-sm text-gray-600">
                  Explore the galaxy of coding and take your skills to the next
                  level
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
    </div>
  );
}

export default StudentDashboard;
