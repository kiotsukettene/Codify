import React, { useState, useEffect } from "react";
import StudentTaskCard from "@/components/student-view/TaskCard";
import { useActivityStore } from "../../store/activityStore";
import { Card } from "@/components/ui/card";
import wave from "@/assets/picture/random-background/wave.png";
import calendarImg from "@/assets/picture/random-background/calendar-img.png";
import { Calendar } from "@/components/ui/calendar";
function StudentTaskPage() {
  const [date, setDate] = useState(new Date());
  const { activities, fetchStudentAllActivities, isLoading } =
    useActivityStore();

    console.log("activities",activities)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStudentAllActivities();
      console.log("Fetched all activities:", data); // Debug log
    };
    fetchData();
  }, [fetchStudentAllActivities]);
  // Categorize activities
  const todoTask = activities.filter((task) => task.status === "Not Submitted");
  const missingTasks = activities.filter((task) => task.status === "Missing");
  const completedTasks = activities.filter((task) => task.isCompleted); // Empty unless submissions added
  if (isLoading) {
    return <div className="container mx-auto py-4">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto py-4">
    <div className="flex flex-col lg:flex-row gap-4 h-full">

      {/* Main Content - Tasks Section */}
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">



           {/* ============================
            // TO DO TASK
            ============================ */}
           <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h2 className="font-medium">To Do</h2>
                <span className="bg-gray-100 px-2 rounded-full text-sm">
                  {todoTask.length}
                </span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-orange-400 my-1" />
              <div className="space-y-3">
                {todoTask.length > 0 ? (
                  todoTask.map((task, index) => (
                    <StudentTaskCard key={index} {...task} />
                  ))
                ) : (
                  <p>No tasks to do.</p>
                )}
              </div>
            </div>
            {/* Completed Tasks */}
            <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="font-medium">Completed</h2>
                <span className="bg-gray-100 px-2 rounded-full text-sm">
                  {completedTasks.length}
                </span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-green-500 my-1" />
              <div className="space-y-3">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task, index) => (
                    <StudentTaskCard key={index} {...task} />
                  ))
                ) : (
                  <p>No completed tasks.</p>
                )}
              </div>
            </div>
            {/* Missing Tasks */}
            <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h2 className="font-medium">Missing</h2>
                <span className="bg-gray-100 px-2 rounded-full text-sm">
                  {missingTasks.length}
                </span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-red-500 my-1" />
              <div className="space-y-3">
                {missingTasks.length > 0 ? (
                  missingTasks.map((task, index) => (
                    <StudentTaskCard key={index} {...task} />
                  ))
                ) : (
                  <p>No missing tasks.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Calendar & Summary */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col justify-between h-full">
          <div className="space-y-4">
            {/* Space Computer Image */}
            <div className="lg:w-full w-72 justify-center items-center mx-auto aspect-square rounded-2xl bg-[#5555A4] overflow-hidden">
              <img
                src={calendarImg || "/placeholder.svg"}
                alt="Space Computer"
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="border-none shadow-none flex justify-center items-center bg-transparent">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </Card>

            {/* Total Tasks */}
            <Card className="p-4 border-none shadow-none lg:bg-white w-80 bg-[#F5F5F5] rounded-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-primary">
                    {todoTask.length +
                      completedTasks.length +
                      missingTasks.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Wave Image */}
          <div className="lg:w-full w-80  items-center justify-center mx-auto aspect-square rounded-2xl overflow-hidden mt-4">
            <img src={wave || "/placeholder.svg"} alt="Wave decoration" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentTaskPage;