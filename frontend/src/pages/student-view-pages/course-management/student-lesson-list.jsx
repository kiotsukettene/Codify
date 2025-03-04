import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowDown,
  Blend,
  Flower,
  GraduationCap,
  PlayIcon,
  Star,
  Tags,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

//MOCK DATA IMPORT
import lessonData from "@/mock/lesson-list";
import lessonOverview from "@/mock/lesson-overview";

import { useNavigate } from "react-router-dom";

function StudentLessonListPage() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  // Function to handle adventure button click
  const handleAdventureClick = () => {
    setShowGuide(true);
    // Auto-hide the guide after 5 seconds
    setTimeout(() => setShowGuide(false), 5000);
  };

  return (
    <div className="flex flex-col mx-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-2/3 p-4 rounded-lg h-screen overflow-hidden">
          <div className="flex-row">
            {/* Lesson Overview Card */}
            <Card className="bg-[#F5F5FF] shadow-none border-none rounded-sm py-4 px-6">
              <CardHeader className="text-header text-4xl font-semibold">
                <Flower size={60} color="#1E87F0" />
                <CardTitle className="text-4xl text-neutral-900">
                  {lessonOverview.title}
                </CardTitle>
                <CardDescription className="font-normal mt-2 text-base text-justify">
                  {lessonOverview.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex w-full mx-auto gap-3 mt-4">
                <Button onClick={handleAdventureClick}>
                  Start Your Learning Adventure 📚
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  <Video /> Arena
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  <Blend />
                </Button>
              </CardFooter>
            </Card>

            {/* Instructor Information */}
            <div className="mt-5">
              <Card className="shadow-none border-none">
                <div className="flex-row">
                  <CardHeader className="flex">
                    <div className="flex">
                      <Avatar>
                        <AvatarFallback />
                      </Avatar>
                      <div className="flex flex-col space-y-2 ml-3">
                        <Label>{lessonOverview.professor.name}</Label>
                        <Label className="font-light">
                          {lessonOverview.professor.courseCode}
                        </Label>
                      </div>
                      <div className="flex ml-auto items-center text-center justify-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-medium gap-2 bg-gray-100 text-gray-700 py-1"
                        >
                          <Star size={16} /> {lessonOverview.stats.totalLessons}{" "}
                          Lessons
                        </Badge>
                        <Badge
                          variant="outline"
                          className="font-medium gap-2 bg-gray-100 text-gray-700 py-1"
                        >
                          <GraduationCap size={16} />
                          {lessonOverview.stats.totalStudents} Students
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardTitle className="text-lg font-semibold text-neutral-900 mt-4">
                      Course Description
                    </CardTitle>
                    <CardDescription className="text-md text-justify font-light mt-6 leading-relaxed">
                      Networking is the study of how computers, devices, and
                      systems connect and communicate with each other. It
                      focuses on the design, implementation, and management of
                      networks that allow information to be shared across the
                      globe. This lesson explores how networks enable seamless
                      communication between devices and people. It covers the
                      fundamentals of data transmission, the role of
                      communication protocols, and the importance of network
                      infrastructure in modern connectivity. Learners will
                      understand how networks support everything from simple
                      email exchanges to complex global systems, forming the
                      backbone of the digital age.
                    </CardDescription>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* =============================
      ========Right Side Content ======
      =============================*/}

        <div className="w-full lg:w-1/3 p-4">
          <div className="bg-blue-200 text-neutral-900 py-3 px-4 font-medium rounded-lg mb-6 text-center">
            Explore Your Cosmic Lessons
          </div>

          {/*==================== Lesson List=================== */}
          <motion.div>
            {lessonData.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                className="relative"
                whileHover={
                  index === 0
                    ? {
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
              >
                {/* Animated Guide Arrow and Tooltip */}
                <AnimatePresence>
                  {showGuide && index === 0 && (
                    <>
                      {/* Floating Arrow */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                          opacity: 1,
                          y: [0, 10, 0],
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          y: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
                      >
                        <ArrowDown className="w-8 h-8 text-purple-500" />
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-20
                      bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm
                      whitespace-nowrap"
                      >
                        Click here to begin your first lesson!
                        <div
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                      border-8 border-transparent border-t-purple-600"
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/*==================== Course Card ====================*/}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="bg-white shadow-none border-sm rounded-lg mb-5 overflow-hidden relative transition-all duration-300 ">
                        
                        {/*==================== tag/badge for first lesson only ====================*/}
                        {index === 0 && (
                          <div className="absolute top-3 right-3 bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Recommended First Lesson
                          </div>
                        )}

                        <CardHeader className="flex gap-3">
                          <motion.span
                            className="text-5xl text-blue-600"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {lesson.icon}
                          </motion.span>
                          <div className="flex flex-col">
                            <CardTitle className="text-lg font-semibold">
                              {lesson.title}
                            </CardTitle>
                            <CardDescription className="text-sm font-light">
                              {lesson.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between">
                          <Badge className="text-sm font-medium bg-[#ffdc9b] text-orange-500">
                            {lesson.code}
                          </Badge>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              // onClick={() => navigate(`/student/module/${lesson.id}`)}
                              onClick={() => navigate("/student/module")} // change this with the correct path like the above comment line
                              variant="secondary"
                              className="border-primary bg-purple-200 text-purple-800 hover:bg-purple-100 transition-colors duration-300"
                            >
                              Start
                            </Button>
                          </motion.div>
                        </CardFooter>
                      </Card>
                    </TooltipTrigger>
                    {index === 0 && (
                      <TooltipContent
                        side="top"
                        className="bg-purple-500 text-white"
                      >
                        <p>Start here to begin your learning journey!</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StudentLessonListPage;
