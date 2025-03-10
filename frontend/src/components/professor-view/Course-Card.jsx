import React, { useState } from "react";
import PropTypes from "prop-types";
import { Monitor } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "@/store/courseStore";
import { toast } from "react-hot-toast";
import DeleteDialog from "../Dialog/DeleteDialog"; // ✅ Import DeleteDialog

const Card = ({
  lessonCount,
  languages,
  title,
  courseCode,
  section,
  courseId,
}) => {
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // ✅ Manage dialog state

  const handleDeleteCourse = async () => {
    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }

    try {
      await useCourseStore.getState().deleteCourse(courseId);
      toast.success("Course deleted successfully!");
      setIsDeleteDialogOpen(false); // ✅ Close dialog after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const languageColors = {
    "c#": "bg-green-200 text-green-800",
    ai: "bg-indigo-200 text-indigo-800",
    css: "bg-pink-200 text-pink-800",
    javascript: "bg-yellow-200 text-yellow-800",
    python: "bg-blue-200 text-blue-800",
    html: "bg-red-200 text-red-800",
    "c++": "bg-purple-200 text-purple-800",
  };

  const testLang = "JavaScript"; // Replace with any test language
  const classes =
    languageColors[testLang.toLowerCase()] || "bg-gray-200 text-gray-800";
  console.log(`Classes for ${testLang}:`, classes);

  return (
    <div className="w-[230px] sm:w-[240px] h-[320px] transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
      <div
        className="relative w-full h-full shadow-md hover:shadow-none"
        style={{
          transform: "skewX(-15deg)",
          clipPath:
            "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 50px 100%, 0 calc(100% - 50px))",
          border: "2px solid #EEE4FF",
          transformStyle: "preserve-3d",
          overflow: "hidden",
        }}
      >
        <div className="h-[60%] bg-purple-100 p-0 relative">
          {/* Lessons count with desktop icon */}
          <div
            className="absolute left-0 w-full h-[30px] flex items-center justify-center bg-white bg-opacity-20"
            style={{
              backgroundSize: "cover",
              clipPath: "polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-600 pl-1">
              {lessonCount} Lessons
            </span>
          </div>

          {/* Pics */}
          <div className="absolute bottom-2 right-3 flex -space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
          </div>
        </div>

        {/* Bottom section */}
        <div className="h-[10%] bg-white p-2 sm:p-3 relative text-center">
          <div className="flex justify-between items-start">
            {/* Language tags */}
            <div className="flex gap-2">
              {Array.isArray(languages) ? (
                languages.map((lang, index) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      languageColors[lang.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800">
                  {languages || "No Language"}
                </span>
              )}
            </div>

            {/* Options */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
              >
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </div>

          {/* Infos */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-purple-700 mb-1 mt-3">
              {title}
            </h3>
            <p className="text-gray-400 text-[10px] sm:text-xs">
              {courseCode} | {section}
            </p>
          </div>
        </div>

        {/* Cuts */}
        <div
          className="absolute bottom-0 left-0 w-12 h-12 bg-purple-200"
          style={{
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
      {/* Delete Dialog */}
      <DeleteDialog
        title="Delete Course"
        description={`Are you sure you want to delete the course "${title}"? This action cannot be undone.`}
        isOpen={isDeleteDialogOpen} // ✅ Pass dialog state
        onConfirm={handleDeleteCourse} // ✅ Handle delete
        onCancel={() => setIsDeleteDialogOpen(false)} // ✅ Close dialog
      />
    </div>
  );
};

Card.propTypes = {
  courseId: PropTypes.string.isRequired, // ✅ Ensure courseId is a prop
  lessonCount: PropTypes.number.isRequired,
  languages: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  courseCode: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
};

export default Card;
