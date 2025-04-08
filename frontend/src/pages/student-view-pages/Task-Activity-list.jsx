import StudentTaskCard from "@/components/student-view/TaskCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import wave from "@/assets/picture/random-background/wave.png";
import calendarImg from "@/assets/picture/random-background/calendar-img.png";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

function StudentTaskPage() {
  const [date, setDate] = useState(new Date());

  const todoTask = [
    {
      subject: "Software Engineering 1",
      activity: "Create a Landing Page",
      dueDate: "Nov 20, 03:00 pm",
      status: "Not Submitted",
      isCompleted: false,
    },
    {
      subject: "Software Engineering 1",
      activity: "ERD",
      dueDate: "Nov 20, 03:00 pm",
      status: "Not Submitted",
      isCompleted: false,
    },
    {
      subject: "System Fundamentals",
      activity: "Create a Login Page",
      dueDate: "Nov 20, 03:00 pm",
      status: "Not Submitted",
      isCompleted: false,
    },
    {
      subject: "Web System and Technologies",
      activity: "Create a Landing Page",
      dueDate: "Nov 20, 03:00 pm",
      status: "Not Submitted",
      isCompleted: false,
    },
  ];

  const completedTasks = [
    {
      subject: "System Fundamentals",
      activity: "DFD",
      dueDate: "Nov 20, 03:00 pm",
      status: "Completed",
      isCompleted: true,
    },
    {
      subject: "Networks and Communications",
      activity: "Cisco Packet Tracer",
      dueDate: "Nov 20, 03:00 pm",
      status: "Completed",
      isCompleted: true,
    },
    {
      subject: "System Fundamentals",
      activity: "Context Diagram",
      dueDate: "Nov 20, 03:00 pm",
      status: "Completed",
      isCompleted: true,
    },
  ];

  const missingTasks = [
    {
      subject: "System Fundamentals",
      activity: "DFD",
      dueDate: "Nov 20, 03:00 pm",
      status: "Missing",
      isCompleted: false,
    },
    {
      subject: "Networks and Communications",
      activity: "Cisco Packet Tracer",
      dueDate: "Nov 20, 03:00 pm",
      status: "Missing",
      isCompleted: false,
    },
  ];

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
                <span className="bg-gray-100 px-2 rounded-full text-sm">{todoTask.length}</span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-orange-400 my-1" />
              <div className="space-y-3">
                {todoTask.map((task, index) => (
                  <StudentTaskCard key={index} {...task} />
                ))}
              </div>
            </div>


          

           {/* ============================
            // COMPLETED TASK
            ============================ */}
          <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="font-medium">Completed</h2>
                <span className="bg-gray-100 px-2 rounded-full text-sm">{completedTasks.length}</span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-green-500 my-1" />
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <StudentTaskCard key={index} {...task} />
                ))}
              </div>
            </div>




           {/* ============================
            // MISSING TASK
            ============================ */}
            <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h2 className="font-medium">Missing</h2>
                <span className="bg-gray-100 px-2 rounded-full text-sm">{missingTasks.length}</span>
              </div>
              <hr className="w-full border-t-2 rounded-full border-red-500 my-1" />
              <div className="space-y-3">
                {missingTasks.map((task, index) => (
                  <StudentTaskCard key={index} {...task} />
                ))}
              </div>
            </div>
          </div>
        </div>

        

       {/* ============================
      // Calendar & Summary
      ============================ */}
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

            {/* Calendar */}
            <Card className="border-none shadow-none flex justify-center items-center bg-transparent">
              <Calendar mode="single" selected={date} onSelect={setDate}/>
            </Card>

            {/* Total Tasks */}
            <Card className="p-4 border-none shadow-none lg:bg-white w-80 bg-[#F5F5F5] rounded-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-primary">
                    {todoTask.length + completedTasks.length + missingTasks.length}
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
