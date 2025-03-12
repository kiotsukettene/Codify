import React from "react";

import planet from "@/assets/picture/random-background/planet.png";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { FolderClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentTaskCard = ({ subject, activity, dueDate, status, isCompleted, }) => {

  const navigate = useNavigate()
  return (
    <div className="bg-white py-4 px-6 rounded-xl">
      {/* =============== CARD HEADER (Icon & Status) ==================== */}
      <div className="flex items-center justify-between">
        <img src={planet} alt="" />
       <Badge
  className={`px-2 py-1 rounded-full text-xs font-medium 
    ${isCompleted ? "bg-green-100 text-green-700" : 
    status === "Missing" ? "bg-red-100 text-red-700" : 
    "bg-gray-100 text-gray-700"}
  `}
>
  {status}
</Badge>

      </div>

      {/* =============== SUBJECT, ACTIVITY, DEADLINE ==================== */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-lg text-neutral-900">{subject}</h3>
        <p className="text-base text-gray-500">Activity: {activity}</p>
        <p className="text-sm text-primary">{dueDate}</p>
      </div>

      {/* =============== VIEW DETAILS BUTTON =================== */}

      <div className="flex justify-end mt-3">
        <Button
          onClick={() => navigate("/student/activity")}
          variant="link"
          className="text-gray-600 hover:text-primary flex items-center"
        >
          <FolderClosed className="mr-2" /> View Details
        </Button>
      </div>
    </div>
  );
};

export default StudentTaskCard;
