import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import lessonData from "@/mock/lesson";
import StudentLessonContent from "@/components/student-view/student-lesson-content";
import totalXpImg from "@/assets/picture/courses/totalXp.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, ChevronDown, Lock, PlayCircle } from "lucide-react";
import XPChallengeCard from "@/components/student-view/XPChallengeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentActivityPage from "./student-activity";

function StudentModulePage() {
  const location = useLocation();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    //API call to get lessons
    setLessons(lessonData);
  }, []);

  const topics = [
    {
      id: 1,
      title: "Learn The Protocols",
      icon: CheckCircle,
      isActive: true,
      isCompleted: true,
      xp: 10,
    },
    { id: 2, title: "What is Lan?", icon: PlayCircle, xp: 10 },
    {
      id: 3,
      title: "Practice, Practice, Practice",
      icon: PlayCircle,
      xp: 10,
    },
    {
      id: 4,
      title: "Make a diagram",
      icon: PlayCircle,
      xp: 10,
    },
  ];

  return (
    <div className="flex flex-row mt-5">
    <div className="w-full lg:w-3/4">
      <Card className="shadow-none border-none bg-white p-6">
        <CardTitle>Module 1: Introduction to Networking</CardTitle>

        <div className="mt-5">
          {lessons.map((lesson) => (
            <StudentLessonContent
              key={lesson.id}
              title={lesson.title}
              content={lesson.content}
            />
          ))}
        </div>
      </Card>
    </div>

    <div className="w-full lg:w-1/4 px-5">
      <Card
        className="relative flex items-center justify-between mb-5 p-4 md:p-6 border-none shadow-none h-16 md:h-20 rounded-3xl max-w-[200px] md:max-w-md"
        style={{
          background:
            "linear-gradient(90deg, rgb(243, 232, 255) 0%, rgb(224, 242, 254) 100%)",
        }}
      >
        <div className="z-10">
          <CardTitle className="text-xs md:text-sm lg:text-lg text-[#8268AE] font-medium">
            Total XP Earned
          </CardTitle>
          <h2 className="text-lg md:text-2xl lg:text-3xl text-[#7548C1] font-bold">
            40 XP
          </h2>
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 w-20 md:w-24 lg:w-28">
          <img
            src={totalXpImg}
            className="w-full h-auto object-cover"
            alt="Astronaut XP Icon"
          />
        </div>
      </Card>

      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg shadow-none border-none p-4"
      >
        <AccordionItem value="topics">
          <AccordionTrigger className="flex justify-between items-center p-4 hover:bg-gray-50">
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-semibold text-gray-900">
                Topics Covered
              </h2>
              <span className="text-sm text-gray-400">
                Progress: 20% Completed
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "20%" }}
                ></div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`relative flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 rounded-lg ${
                    topic.isActive
                      ? "bg-purple-50 border-l-4 border-purple-500"
                      : topic.isCompleted
                      ? "bg-green-50 border-l-4 border-green-500"
                      : ""
                  }`}
                >
                  <div className="pl-4">
                    <h3 className="font-medium text-gray-900">
                      {topic.id}: {topic.title}
                      {topic.isCompleted && (
                        <span className="ml-2 text-sm text-green-600">
                          +{topic.xp} XP
                        </span>
                      )}
                    </h3>
                  </div>
                  {topic.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                  ) : (
                    <PlayCircle className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-5">
        <XPChallengeCard />
      </div>
    </div>
  </div>
  );
}

export default StudentModulePage;
