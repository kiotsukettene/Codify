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
import { Blend, Flower, GraduationCap, PlayIcon, Star, Tags, Video } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

//MOCK DATA IMPORT
import lessonData from "@/mock/lesson-list";
import lessonOverview from "@/mock/lesson-overview";


import { useNavigate } from "react-router-dom";







function StudentLessonListPage() {
  const navigate = useNavigate();
 

  return (
    <div className="flex flex-col mx-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-2/3 p-4 bg-white rounded-lg h-screen overflow-hidden">
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
                <Button>Start Learning</Button>
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
                        <Label className="font-light">{lessonOverview.professor.courseCode}</Label>
                      </div>
                      <div className="flex ml-auto items-center text-center justify-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-medium gap-2 bg-gray-100 text-gray-700 py-1"
                        >
                          <Star size={16} /> {lessonOverview.stats.totalLessons} Lessons
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
          {/* Blur Effect and Overlay for First Lesson Only */}
          {index === 0 && (
            <motion.div
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-10 rounded-lg cursor-pointer"
              // onClick={() => navigate(`/student/module/${lesson.id}`)}
              onClick={() => navigate("/student/module")}  
            >
              <motion.span
                className="text-white text-lg font-semibold flex items-center gap-2 px-6 py-3 bg-primary/80 rounded-full"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(var(--primary), 1)",
                  boxShadow: "0 0 10px rgba(var(--primary), 0.5)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <PlayIcon className="w-5 h-5" />
                </motion.div>
                Start Learning
              </motion.span>
            </motion.div>
          )}

          {/*==================== Course Card ====================*/}
          <Card
            className={`bg-white shadow-none border-none rounded-lg mb-5 overflow-hidden relative transition-all duration-300 ${
              index === 0 ? "opacity-90 hover:opacity-100" : "hover:shadow-sm hover:translate-y-[-2px]"
            }`}
          >
            <CardHeader className="flex gap-3">
              <motion.span
                className="text-5xl text-blue-600"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {lesson.icon}
              </motion.span>
              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold">{lesson.title}</CardTitle>
                <CardDescription className="text-sm font-light">{lesson.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
              <Badge className="text-sm font-medium bg-[#ffdc9b] text-orange-500">{lesson.code}</Badge>
              {index !== 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate(`/student/module/${lesson.id}`)}
                    variant="secondary"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Start Learning
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>


        </div>
      </div>
       



    </div>
  );
}

export default StudentLessonListPage;
