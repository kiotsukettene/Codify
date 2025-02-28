import React from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ActivityTab = ({ activities, courseId, lessonId }) => {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500">No activities available.</p>;
  }
  const navigate = useNavigate();

  // Ensure activities is always treated as an array
  const activitiesArray = Array.isArray(activities) ? activities : [activities];

  const handleActivityClick = (activity) => {
    navigate(
      `/professor/course/${courseId}/lesson/${lessonId}/activity/${activity._id}`,
      { state: { activity } }
    );
  };

  return (
    <div className="grid gap-4">
      {activities.map((activity) => {
        // Format the due date
        const formattedDueDate = activity.dueDate
          ? new Date(activity.dueDate).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "No due date";

        return (
          <Button
            key={activity._id}
            onClick={() => handleActivityClick(activity)}
            variant="ghost"
            className="w-full p-0 h-auto hover:bg-accent/50"
          >
            <Card className="w-full p-4 cursor-pointer border hover:border-purple-300 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <h3>
                      Mission {activity.id} : {activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Due: {formattedDueDate}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-400 hover:bg-purple-100"
                >
                  {activity.submitted || 0}/{activity.total || 0} Submitted
                </Badge>
              </div>
            </Card>
          </Button>
        );
      })}
    </div>
  );
};

export default ActivityTab;
