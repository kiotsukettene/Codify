"use client"
import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"
import { EventHoverCard } from "@/components/student-view/hover-card-schedule"
import toast from "react-hot-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import CreateEventModal from "@/components/student-view/create-schedule"

function StudentCalendar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [completedEvents, setCompletedEvents] = useState(0)
  const [totalEvents, setTotalEvents] = useState(0) // not completed function wag po ito
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [isEditingEvent, setIsEditingEvent] = useState(false)
  const [isDeletingEvent, setIsDeletingEvent] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)

  const isDev = import.meta.env.MODE === "development"
  const API_URL = isDev ? "http://localhost:3000/api/events" : `${import.meta.env.VITE_API_URL}/api/events`

  const priorities = [
    { label: "High Priority", description: "Urgent or high-priority tasks", value: "high", color: "#f87171" },
    { label: "Medium Priority", description: "Medium-priority tasks", value: "medium", color: "#fdba74" },
    { label: "Low Priority", description: "Low-priority tasks or completed events", value: "low", color: "#60a5fa" },
  ]

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        console.log("Fetching events for:", { start, end })

        const response = await fetch(
          `${API_URL}/?start=${start.toISOString()}&end=${end.toISOString()}`,
          {
            method: "GET",
            credentials: "include",
          },
        )

        console.log("Fetch events response status:", response.status)
        if (!response.ok) {
          let errorData
          try {
            errorData = await response.json()
          } catch (jsonError) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          throw new Error(errorData.message || "Failed to fetch events")
        }

        const data = await response.json()
        console.log("Fetched events:", data)

        const mappedEvents = data.data.map((event) => {
          const priorityValue = event.priority.toLowerCase()
          const priorityObj = priorities.find((p) => p.value === priorityValue) || priorities[2]

          return {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: priorityObj.color,
            borderColor: priorityObj.color,
            textColor: "#ffffff",
            extendedProps: {
              completed: false,
              priority: priorityValue,
              notes: "",
            },
          }
        })

        console.log("Mapped events:", mappedEvents)
        setEvents(mappedEvents)
      } catch (error) {
        console.error("Error fetching events:", error.message)
        toast.error(error.message || "Failed to load events")
        setEvents([])
      }
    }

    fetchEvents()
  }, [currentDate])

  useEffect(() => {
    setTotalEvents(events.length)
    setCompletedEvents(events.filter((event) => event.extendedProps?.completed).length)
  }, [events])

  const progressPercentage = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() - 1)
      return newDate
    })
  }
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() + 1)
      return newDate
    })
  }
  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const addEvent = async (newEvent) => {
    try {
      setIsAddingEvent(true)

      const startDateTime = new Date(newEvent.start)
      const endDateTime = new Date(newEvent.end)
      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time")
      }

      const [date] = newEvent.start.split("T")
      const startTime = newEvent.start.split("T")[1].slice(0, 5)
      const endTime = newEvent.end.split("T")[1].slice(0, 5)
      const priorityValue = priorities.find((p) => p.color === newEvent.backgroundColor)?.value

      if (!priorityValue) {
        throw new Error("Invalid priority selected")
      }

      const payload = {
        title: newEvent.title,
        date,
        startTime,
        endTime,
        priority: priorityValue,
      }

      console.log("Creating event with payload:", payload)

      const response = await fetch(`${API_URL}/api/events/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      console.log("Create event response status:", response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again")
        } else if (response.status === 400) {
          throw new Error(errorData.message || "Invalid event data")
        } else {
          throw new Error(errorData.message || "Failed to create event")
        }
      }

      const createdEvent = await response.json()
      console.log("Created event:", createdEvent)

      const priorityObj = priorities.find((p) => p.value === priorityValue) || priorities[2]

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: createdEvent.event.id,
          title: createdEvent.event.title,
          start: createdEvent.event.start,
          end: createdEvent.event.end,
          backgroundColor: priorityObj.color,
          borderColor: priorityObj.color,
          textColor: "#ffffff",
          extendedProps: {
            completed: false,
            priority: priorityValue,
            notes: "",
          },
        },
      ])

      toast.success("Event created successfully!")
    } catch (error) {
      console.error("Error creating event:", error.message)
      toast.error(error.message || "Failed to create event")
    } finally {
      setIsAddingEvent(false)
    }
  }

  const editEvent = async (updatedEvent) => {
    try {
      setIsEditingEvent(true)

      const startDateTime = new Date(updatedEvent.start)
      const endDateTime = new Date(updatedEvent.end)
      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time")
      }

      const [date] = updatedEvent.start.split("T")
      const startTime = updatedEvent.start.split("T")[1].slice(0, 5)
      const endTime = updatedEvent.end.split("T")[1].slice(0, 5)
      const priorityValue = priorities.find((p) => p.color === updatedEvent.backgroundColor)?.value

      if (!priorityValue) {
        throw new Error("Invalid priority selected")
      }

      const payload = {
        title: updatedEvent.title,
        date,
        startTime,
        endTime,
        priority: priorityValue,
      }

      console.log("Updating event with payload:", payload)

      const response = await fetch(`${API_URL}/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      console.log("Update event response status:", response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again")
        } else if (response.status === 400) {
          throw new Error(errorData.message || "Invalid event data")
        } else if (response.status === 404) {
          throw new Error(errorData.message || "Event not found")
        } else {
          throw new Error(errorData.message || "Failed to update event")
        }
      }

      const updatedEventData = await response.json()
      console.log("Updated event:", updatedEventData)

      const priorityObj = priorities.find((p) => p.value === priorityValue) || priorities[2]

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id
            ? {
                id: updatedEventData.event.id,
                title: updatedEventData.event.title,
                start: updatedEventData.event.start,
                end: updatedEventData.event.end,
                backgroundColor: priorityObj.color,
                borderColor: priorityObj.color,
                textColor: "#ffffff",
                extendedProps: {
                  completed: event.extendedProps.completed,
                  priority: priorityValue,
                  notes: event.extendedProps.notes,
                },
              }
            : event
        )
      )
      toast.success("Event updated successfully!")

    } catch (error) {
      console.error("Error updating event:", error.message)
      toast.error(error.message || "Failed to update event")
    } finally {
      setIsEditingEvent(false)
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      setIsDeletingEvent(true)

      console.log("Deleting event with ID:", eventId)

      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      })

      console.log("Delete event response status:", response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again")
        } else if (response.status === 404) {
          throw new Error(errorData.message || "Event not found")
        } else {
          throw new Error(errorData.message || "Failed to delete event")
        }
      }

      const data = await response.json()
      console.log("Delete event response:", data)

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))

      toast.success("Event deleted successfully!")
      
    } catch (error) {
      console.error("Error deleting event:", error.message)
      toast.error(error.message || "Failed to delete event")
    } finally {
      setIsDeletingEvent(false)
    }
  }

  // Handle event drop (drag-and-drop)
  const handleEventDrop = async (info) => {
    try {
      const event = info.event;
      const updatedEvent = {
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : event.start.toISOString(), // Ensure end time exists
        backgroundColor: event.backgroundColor,
      };

      // Update the event on the backend
      await editEvent(updatedEvent);

      // Update the local state (already handled in editEvent, but ensure UI is in sync)
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id
            ? {
                ...ev,
                start: event.start.toISOString(),
                end: event.end ? event.end.toISOString() : event.start.toISOString(),
              }
            : ev
        )
      );

      toast.success("Event rescheduled successfully!");
    } catch (error) {
      console.error("Error rescheduling event:", error.message);
      toast.error(error.message || "Failed to reschedule event");
      // Revert the drag if the update fails
      info.revert();
    }
  }

  // Helper function to format date and time
  const formatEventTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Helper function to format date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const groupEventsByDate = () => {
    const grouped = {}

    events.forEach((event) => {
      const dateKey = event.start.split("T")[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        events: grouped[date],
      }))
  }

  const groupedEvents = groupEventsByDate()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 w-full">
  {/* Sidebar */}
  <div className="w-full md:w-80 border-r border-red-200 flex flex-col bg-white/50 backdrop-blur-sm">
    <div className="p-4 border-b border-blue-200">
      <Button
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
        onClick={() => {
          setEventToEdit(null)
          setIsCreateModalOpen(true)
        }}
        disabled={isAddingEvent || isEditingEvent || isDeletingEvent}
      >
        {isAddingEvent ? "Creating..." : "+ Create Event"}
      </Button>
    </div>

    <ScrollArea className="flex-1 overflow-auto">
      <div className="p-4">
        <div className="text-sm font-medium mb-4 text-blue-800 flex items-center gap-2">
          <div className="h-6 w-1 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></div>
          Status
        </div>
        <div className="space-y-4 ">
          {priorities.map((priority) => (
            <div key={priority.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priority.color }} />
                  <span className="text-sm font-medium">{priority.label}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 pl-5">{priority.description}</p>
            </div>
          ))}
        </div>
      </div>

      {events.length > 0 && (
        <div className="p-4 pt-2">
          <Separator className="my-4" />
          <div className="text-sm font-medium mb-4 text-blue-800 flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></div>
            Your Events
          </div>

          <div className="space-y-4 md:space-y-6">
            {groupedEvents.map((group) => (
              <div key={group.date} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet-500" />
                  <span className="text-xs font-semibold text-gray-700">
                    {new Date(group.date).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {group.events.map((event) => {
                  const priorityObj = priorities.find((p) => p.value === event.extendedProps.priority)
                  return (
                    <Card
                      key={event.id}
                      className="overflow-hidden border-l-4 hover:shadow-md transition-all cursor-pointer w-full"
                      style={{ borderLeftColor: event.backgroundColor }}
                      onClick={() => {
                        setEventToEdit(event)
                        setIsCreateModalOpen(true)
                      }}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm break-words">{event.title}</h4>
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5"
                              style={{ color: event.backgroundColor }}
                            >
                              {event.extendedProps.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatEventTime(event.start)} - {formatEventTime(event.end)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </ScrollArea>
  </div>

  {/* Calendar Section */}
  <div className="flex-1 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-violet-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-violet-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-blue-900">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="border-violet-200 hover:bg-violet-100 hover:text-violet-700"
        >
          Today
        </Button>
      </div>
    </div>

    <div className="flex-1 p-4 overflow-visible max-w-full truncate">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={events}
        initialDate={currentDate}
        key={currentDate.toISOString()}
        height="100%"
        dayMaxEvents={true}
        eventDisplay="block"
        editable={true}
        eventDrop={handleEventDrop}
        eventContent={(arg) => (
          <EventHoverCard
            className=''
            event={arg}
            onEventUpdate={(updatedEvent) => {
              setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
            }}
          />
        )}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
      />
    </div>
  </div>

  {/* Modal */}
  <CreateEventModal
    open={isCreateModalOpen}
    onOpenChange={(open) => {
      setIsCreateModalOpen(open)
      if (!open) {
        setEventToEdit(null)
      }
    }}
    addEvent={addEvent}
    editEvent={editEvent}
    deleteEvent={deleteEvent}
    eventToEdit={eventToEdit}
    isAddingEvent={isAddingEvent}
    isEditingEvent={isEditingEvent}
    isDeletingEvent={isDeletingEvent}
  />
</div>

  )
}

export default StudentCalendar