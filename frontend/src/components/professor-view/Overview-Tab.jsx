import React from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rocket, Star, MoreVertical, ScrollText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const OverviewTab = ({ lessons = [] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between p-2">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        <Button onClick={() => navigate("/professor/course/create-lesson")}>
          Create Lesson
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson.id}
            value={`lesson-${lesson.id}`}
            className="border rounded-lg bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between p-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 transition-transform duration-300">
                  <div className="bg-violet-100 p-2 rounded transform transition-all duration-200 hover:rotate-12 hover:scale-110">
                    <Rocket
                      className="text-violet-600 animate-pulse"
                      size={20}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lesson.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{lesson.date}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="transition-transform duration-200 hover:scale-110">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="py-1 text-red-600 animate-in slide-in-from-top-2 duration-200">
                    <DropdownMenuItem className="transition-colors duration-200 hover:bg-red-50">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <AccordionContent className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                {lesson.content?.map((item, index) => {
                  // const lessonSlug = item.toLowerCase().replace(/\s+/g, "-");
                  const isMission = item.startsWith("Mission");

                  return (
                    <Link
                      key={`${lesson.id}-${index}`} // Use a composite ke
                      to="/professor/course/topic"
                      className={`group flex items-center gap-2 font-medium cursor-pointer transition-all duration-200 
                        ${
                          isMission
                            ? "text-violet-600"
                            : "text-gray-600 hover:text-violet-600"
                        }
                        transform hover:translate-x-1 hover:scale-[1.02]
                      `}
                    >
                      {isMission ? (
                        <ScrollText className="h-4 w-4 text-violet-600 transition-all duration-200 group-hover:scale-110" />
                      ) : (
                        <Star
                          className={`h-4 w-4 transition-all duration-200 text-gray-400 group-hover:text-violet-600 group-hover:rotate-12`}
                        />
                      )}
                      <span>{item}</span>
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default OverviewTab;
