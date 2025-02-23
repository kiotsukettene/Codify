"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";

import {
  ChevronDown,
  Search,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CreateEventModal } from "@/components/student-view/create-event";
import { EventHoverCard } from "@/components/student-view/hover-card-schedule";

function StudentCalendar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to navigate months dynamically
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Talk to Bobby L.",
      start: "2024-07-08T17:00:00",
      end: "2024-07-08T18:00:00",
      backgroundColor: "#e0e7ff",
      borderColor: "#818cf8",
      textColor: "#4f46e5",
    },
  ]);

  // Function to add new event dynamically
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add new event to the list
  };

  console.log(events);

  const priorities = [
    {
      label: "High Priority",
      description: "Urgent or high-priority tasks",
      color: "#ef4444",
    },
    {
      label: "Medium Priority",
      description: "Medium-priority tasks",
      color: "#f59e0b",
    },
    {
      label: "Low Priority",
      description: "Low-priority tasks or completed events",
      color: "#10b981",
    },
  ];

  return (
    <div className="flex h-screen bg-white w-full">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Event
          </Button>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-4">Status</div>
          <div className="space-y-4">
            {priorities.map((priority) => (
              <div key={priority.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    <span className="text-sm">{priority.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{priority.time}</span>
                </div>
                <p className="text-xs text-gray-500 pl-4">
                  {priority.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Month Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Dynamic Month & Year */}
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Today Button */}
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4">
        <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={false}
      events={events}
      initialDate={currentDate}
      key={currentDate}
      height="100%"
      dayMaxEvents={true}
      eventDisplay="block"
      eventContent={(arg) => <EventHoverCard event={arg} />}
      
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
        meridiem: "short",
      }}
    />
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        addEvent={addEvent}
      />
    </div>
  );
}

export default StudentCalendar;
