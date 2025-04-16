import React from "react";
import card1 from "@/assets/picture/courses/card1.png";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
function StudentCourseCard({ lessons, image, title, professor, category, tags = [], onClick, schedule }) {
  const badgeColors = {
    Networking: "bg-blue-200 text-blue-800",
    AI: "bg-purple-200 text-purple-800",
    Profitable: "bg-green-200 text-green-800",
    Mobile: "bg-yellow-200 text-yellow-800",
    Default: "bg-gray-200 text-gray-800", // Fallback color
  };

  return (
    <Card
      className="w-full h-auto max-w-sm mx-auto rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 dark:bg-gray-950 p-5 cursor-pointer mb-7"
      onClick={onClick} // Add onClick to the Card
    >
      {/* Image Section */}
     
  
      <div className="relative">
        <img
          src={card1}
          alt={title}
          className="w-full h-44 object-cover rounded-lg"
        />
        <span className="absolute top-0 left-0 bg-black text-white text-sm font-medium px-4 py-2 rounded-md">
          Lessons: {lessons}
        </span>
      </div>
      {/* Course Details */}
      <CardContent className="mt-6 space-y-2 p-0 flex-grow">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-purple-700 font-medium">Prof. {professor}</p>
        <p className="text-sm text-purple-500 font-medium">{schedule}</p>
      </CardContent>
      {/* Category Badge */}
      <div className="mt-auto pt-4 flex gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              badgeColors[tag] || badgeColors.Default
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
export default StudentCourseCard;