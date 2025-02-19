import React from "react";
import { Button } from "../ui/button";

const StudentLessonContent = ({ title, content }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Lesson Title */}
      <h2 className="font-medium text-xl text-gray-900 rounded-md p-2 bg-purple-100/80">{title}</h2>

      {/* Lesson Content */}
      <p className="text-gray-800 text-sm mt-4 leading-relaxed">{content}</p>

    
    </div>
  );
};

export default StudentLessonContent;
