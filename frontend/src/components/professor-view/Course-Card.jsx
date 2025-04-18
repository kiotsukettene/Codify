import React, { useState } from "react";
import PropTypes from "prop-types";
import { Monitor } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "@/store/courseStore";
import { toast } from "react-hot-toast";
import DeleteDialog from "../Dialog/DeleteDialog";

const Card = ({ lessonCount, languages, title, courseCode, section, year }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const languageColors = {
    javascript: { bg: "bg-yellow-100", text: "text-yellow-700" },
    python: { bg: "bg-blue-100", text: "text-blue-700" },
    "c++": { bg: "bg-green-100", text: "text-green-700" },
    java: { bg: "bg-orange-100", text: "text-orange-700" },
    default: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  const normalizeLanguage = (lang) => (lang ? lang.toLowerCase() : "");

  return (
    <div className="w-[230px] sm:w-[240px] h-[320px] transform hover:scale-105 transition-transform duration-300">
      <div
        className="relative w-full h-full shadow-lg"
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
          <div
            className="absolute left-0 w-full h-[30px] flex items-center justify-center bg-white bg-opacity-20"
            style={{
              backgroundSize: "cover",
              clipPath: "polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Monitor
              className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
              style={{ transform: "skewX(15deg)" }}
            />
            <span
              className="text-xs sm:text-sm font-medium text-purple-600 pl-1"
              style={{ transform: "skewX(15deg)" }}
            >
              {lessonCount} Lessons
            </span>
          </div>
          <div
            className="absolute bottom-2 right-3 flex -space-x-2"
            style={{ transform: "skewX(15deg)" }}
          >
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
        <div className="h-[10%] bg-white p-2 sm:p-3 relative text-center">
          <div className="flex justify-between items-start bg-white">
            <div className="flex gap-2" style={{ transform: "skewX(15deg)" }}>
              {languages.map((lang, index) => {
                const normalizedLang = normalizeLanguage(lang);
                const color =
                  languageColors[normalizedLang] || languageColors.default;
                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${color.bg} ${color.text}`}
                  >
                    {lang || "No Language"}
                  </span>
                );
              })}
            </div>
            <button
              style={{ transform: "skewX(15deg)" }}
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
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
          <div style={{ transform: "skewX(15deg)" }}>
            <h3 className="text-sm sm:text-base font-semibold text-purple-700 mb-1">
              {title}
            </h3>
            <p className="text-gray-400 text-[10px] sm:text-xs">
              {courseCode} | {year} {section}
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-12 h-12 bg-purple-200"
          style={{
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  courseId: PropTypes.string.isRequired,
  lessonCount: PropTypes.number.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  courseCode: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
  year: PropTypes.string,
};

export default Card;
