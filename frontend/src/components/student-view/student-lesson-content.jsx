import React from "react";
import { Button } from "../ui/button";

const StudentLessonContent = ({ title, content }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Lesson Title */}
      <h2 className="font-bold text-xl text-gray-900">{title}</h2>

      {/* Lesson Content */}
      <p className="text-gray-700 mt-4 leading-relaxed">{content}</p>

      {/* Button Section */}
      <div className="mt-6 border-t pt-4 flex justify-start">
        <Button className="bg-primary text-white hover:bg-purple-700 px-6 py-2 rounded-md">
          🚀 Proceed to Next Lesson
        </Button>
      </div>
    </div>
  );
};

export default StudentLessonContent;
