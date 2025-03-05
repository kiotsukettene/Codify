import React, { useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useLessonStore } from "../../store/lessonStore";
import { formatDate } from "../../utils/formatDate";
import DeleteDialog from "../Dialog/DeleteDialog";
import { useActivityStore } from "../../store/activityStore";

const OverviewTab = ({ lessons = [] }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { fetchLessonById, deleteLesson } = useLessonStore();
  const { fetchActivitiesByLesson, activities } = useActivityStore();
  const [openLesson, setOpenLesson] = useState(null); // ✅ Track open lesson ID
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleToggleLesson = async (lessonId) => {
    if (openLesson === lessonId) {
      setOpenLesson(null);
    } else {
      await fetchActivitiesByLesson(lessonId); // ✅ Fetch only related activities
      setOpenLesson(lessonId);
    }
  };

  const handleDeleteClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLesson) return;
    try {
      await deleteLesson(selectedLesson._id);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
    setShowDeleteDialog(false);
    setSelectedLesson(null);
  };

  const handleLessonClick = async (lesson) => {
    if (!lesson || !lesson._id) {
      console.error("Error: Lesson ID is undefined", lesson);
      return;
    }

    try {
      // Fetch the lesson details
      await fetchLessonById(lesson._id);

      // Navigate with lesson details in the state
      navigate(`/professor/course/${courseId}/lesson/${lesson._id}`, {
        state: { lesson },
      });
    } catch (error) {
      console.error("Error fetching lesson details", error);
    }
  };

  const handleActivityClick = async (activity) => {
    if (!activity || !activity._id || !activity.lessonId) {
      console.error("Error: Activity or Lesson ID is undefined", activity);
      return;
    }

    try {
      // Fetch activities related to the lesson using Zustand store function
      await fetchActivitiesByLesson(activity.lessonId);

      // Navigate with activity details in the state
      navigate(
        `/professor/course/${courseId}/lesson/${activity.lessonId}/activity/${activity._id}`,
        {
          state: { activity },
        }
      );
    } catch (error) {
      console.error("Error fetching activity details", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between p-2">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        <Button
          onClick={() =>
            navigate(`/professor/course/${courseId}/create-lesson`)
          }
        >
          Create Lesson
        </Button>
      </div>

      <DeleteDialog
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isOpen={showDeleteDialog}
      />

      {/* ✅ Control Accordion with openLesson state */}
      <Accordion
        type="single"
        collapsible
        value={openLesson}
        onValueChange={setOpenLesson}
        className="space-y-2"
      >
        {lessons.map((lesson, index) => (
          <AccordionItem
            key={lesson._id}
            value={lesson._id}
            className="border rounded-lg bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between p-4">
              <AccordionTrigger
                onClick={() => handleToggleLesson(lesson._id)}
                className="hover:no-underline"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-violet-100 p-2 rounded transform transition-all duration-200 hover:rotate-12 hover:scale-110">
                    <Rocket
                      className="text-violet-600 animate-pulse"
                      size={20}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">
                      Quest {index + 1} : {lesson.title}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatDate(lesson.createdAt)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="transition-transform duration-200 hover:scale-110">
                    <MoreVertical className="h-5 w-5 text-grey-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="py-1 text-red-600">
                    <DropdownMenuItem
                      className="hover:bg-red-50"
                      onClick={() => handleDeleteClick(lesson)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <AccordionContent className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                {/* ✅ Loop through sections (Standard content) */}
                {lesson.sections?.map((section, index) => {
                  const isMission = section.subTitle.startsWith("Mission");

                  return (
                    <div
                      onClick={() => handleLessonClick(lesson)}
                      key={index}
                      className={`group flex items-center gap-2 font-medium cursor-pointer transition-all duration-200 
            ${
              isMission
                ? "text-violet-600"
                : "text-gray-600 hover:text-violet-600"
            }
            transform hover:translate-x-1 hover:scale-[1.02]`}
                    >
                      {isMission ? (
                        <ScrollText className="h-4 w-4 text-violet-600 transition-all duration-200 group-hover:scale-110" />
                      ) : (
                        <Star className="h-4 w-4 transition-all duration-200 text-gray-400 group-hover:text-violet-600 group-hover:rotate-12" />
                      )}
                      <span>{section.subTitle || "Untitled Section"}</span>
                    </div>
                  );
                })}

                {/* ✅ Loop through activities (Missions) */}
                {/* ✅ Display only activities linked to the lesson */}
                {activities
                  ?.filter((activity) => activity.lessonId === lesson._id)
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 text-violet-600 hover:underline hover:text-violet-700 transition-all duration-200"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <ScrollText className="h-4 w-4 text-violet-600 transition-all duration-200 group-hover:scale-110" />
                      <span className="font-medium">
                        {activity.title || "Unnamed Activity"}
                      </span>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default OverviewTab;
