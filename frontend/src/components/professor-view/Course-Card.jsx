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
      setIsDeleteDialogOpen(false); // Close dialog after deletion
      navigate("/professor/course"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const languageColors = {
    "Javascript": { bg: 'bg-yellow-100', text: 'text-yellow-700'},
    "Python": { bg: 'bg-blue-100', text: 'text-blue-700' },
    "C#": { bg: 'bg-green-100', text: 'text-green-700' },  
    "Java": { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    "No language": { bg: 'bg-purple-100', text: 'text-purple-700' },
};


  

  return (
    <div className="w-[230px] sm:w-[240px] h-[320px] transform hover:scale-105 transition-transform duration-300">
      <div className="relative w-full h-full shadow-lg"
           style={{
             transform: 'skewX(-15deg)',
             clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 50px 100%, 0 calc(100% - 50px))',
             border: '2px solid #EEE4FF',
             transformStyle: 'preserve-3d',
             overflow: 'hidden',
           }}>
            
        <div className="h-[60%] bg-purple-100 p-0 relative" >
          {/* Lessons count with desktop icon */}
          <div className="absolute left-0 w-full h-[30px] flex items-center justify-center bg-white bg-opacity-20"
               style={{
                backgroundSize: 'cover',
                 clipPath: 'polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)',
                 backdropFilter: 'blur(10px)',
               }}>
            <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-600 pl-1" style = {{transform: 'skewX(15deg)' }}>{lessonCount} Lessons</span>
          </div>

          {/* Pics */}


          <div className="absolute bottom-2 right-3 flex -space-x-2" style = {{transform: 'skewX(15deg)' }}>
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
        <div className="h-[10%] bg-white p-2 sm:p-3 relative text-center" >
          <div className="flex justify-between items-start"> 
            {/* Language tags */}
            <div className="flex gap-2" style={{ transform: 'skewX(15deg)' }}>
  {Array.isArray(languages) ? (
    languages.map((lang, index) => {
      const color = languageColors[lang] || languageColors["No language"];
      return (
        <span
          key={index}
          className={`px-2 py-1 rounded-full text-xs ${color.bg} ${color.text}`}
        >
          {lang}
        </span>
      );
    })
  ) : (
    (() => {
      const color = languageColors[languages] || languageColors["No language"];
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${color.bg} ${color.text}`}>
          {languages || "No Language"}
        </span>
      );
    })()
  )}
</div>


            {/* Options */}
            <button
            style = {{transform: 'skewX(15deg)' }}
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

          {/* Infos*/}
          <div style = {{transform: 'skewX(15deg)' }}>
            <h3 className="text-sm sm:text-base font-semibold text-purple-700 mb-1 mt-3">
              {title}
            </h3>
            <p className="text-gray-400 text-[10px] sm:text-xs">
              {courseCode} | {section}
            </p>
          </div>
        </div>

        {/* Cuts */}
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-200"
             style={{
              clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
            }} />
      </div>
    </div>
  )
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
