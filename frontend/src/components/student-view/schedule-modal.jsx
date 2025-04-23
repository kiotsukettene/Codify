"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookHeart, Calendar, Clock, MapPin, User, X, Rocket, Star, Trophy } from "lucide-react"

const ScheduleModal = ({ open, onOpenChange, allCourses }) => {
  const [activeTab, setActiveTab] = useState("all")
  const [animatedCourses, setAnimatedCourses] = useState([])

  // Group courses by day
  const coursesByDay = {
    all: allCourses,
    monday: allCourses.filter((course) => course.schedule?.day.toLowerCase() === "monday"),
    tuesday: allCourses.filter((course) => course.schedule?.day.toLowerCase() === "tuesday"),
    wednesday: allCourses.filter((course) => course.schedule?.day.toLowerCase() === "wednesday"),
    thursday: allCourses.filter((course) => course.schedule?.day.toLowerCase() === "thursday"),
    friday: allCourses.filter((course) => course.schedule?.day.toLowerCase() === "friday"),
    weekend: allCourses.filter(
      (course) => course.schedule?.day.toLowerCase() === "saturday" || course.schedule?.day.toLowerCase() === "sunday",
    ),
  }


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
  



  useEffect(() => {
    if (open) {
      const currentCourses = coursesByDay[activeTab] || []
      setAnimatedCourses([])

      currentCourses.forEach((course, index) => {
        setTimeout(() => {
          setAnimatedCourses((prev) => [...prev, course])
        }, index * 100)
      })
    }
  }, [activeTab, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-purple-200">

        <div className="relative p-6  bg-purple-700">

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Rocket className="h-6 w-6 text-yellow-300" />
              <span className="bg-clip-text text-white">
                All Courses Schedules
              </span>
            </h2>
           
          </div>

          <p className="text-purple-50 mt-1">Explore your complete class schedule</p>

          {/* Floating stars decoration */}
          <motion.div
            className="absolute top-2 right-12 text-yellow-300"
            animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="h-4 w-4 fill-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-32 text-yellow-300"
            animate={{ y: [0, 5, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="h-3 w-3 fill-yellow-300" />
          </motion.div>
        </div>

        {/* Tabs for filtering by day */}
        <div className="p-4 border-b border-purple-200 bg-white/50 backdrop-blur-sm">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 bg-purple-100/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="monday" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Mon
              </TabsTrigger>
              <TabsTrigger value="tuesday" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Tue
              </TabsTrigger>
              <TabsTrigger
                value="wednesday"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                Wed
              </TabsTrigger>
              <TabsTrigger
                value="thursday"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                Thu
              </TabsTrigger>
              <TabsTrigger value="friday" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Fri
              </TabsTrigger>
              <TabsTrigger value="weekend" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Weekend
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Course list with animations */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
          {animatedCourses.length > 0 ? (
            animatedCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`${course.bgColor || getRandomBgColor(index)} rounded-xl p-4 hover:translate-x-2 hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden`}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mt-8 -mr-8"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-white/10 rounded-full -mb-4 -ml-4"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      className={`${course.color || getRandomColor(index)} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold border-4 border-white `}
                    >
                      {course.initials || course.className?.substring(0, 2).toUpperCase() || "NA"}
                    </motion.div>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{course.className || "Unnamed Course"}</h3>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1 text-purple-500" />
                          <span>{course.schedule?.day || "Day TBD"}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1 text-purple-500" />
                          <span>{formatHour(course.schedule?.time)}</span>

                        </div>

                        {course.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1 text-purple-500" />
                            <span>{course.location}</span>
                          </div>
                        )}

                        {course.instructor && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-3 w-3 mr-1 text-purple-500" />
                            <span>{course.instructor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                
                </div>

             
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 text-center px-auto space-x-2 flex flex-col h-40 justify-center items-center">
              <BookHeart className="w-9 h-9" />
              <p className="text-lg">No classes scheduled for this day</p>
            </div>
          )}
        </div>

        {/* Footer with stats */}
        <div className="p-4 border-t border-purple-200 bg-white/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{allCourses.length}</span> total classes scheduled
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get random background colors
const getRandomBgColor = (index) => {
  const colors = [
    "bg-blue-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-indigo-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-red-50",
    "bg-teal-50",
    "bg-cyan-50",
  ]
  return colors[index % colors.length]
}

// Helper function to get random accent colors
const getRandomColor = (index) => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-cyan-500",
  ]
  return colors[index % colors.length]
}



// Helper function for confetti colors
const getRandomConfettiColor = () => {
  const colors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default ScheduleModal
