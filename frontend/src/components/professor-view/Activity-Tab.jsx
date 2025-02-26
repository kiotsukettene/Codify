import React from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ActivityTab = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500">No activities available.</p>;
  }

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
          <Link
            key={activity._id}
            to={`/mission/${activity._id}`}
            className="w-full"
          >
            <Button
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
          </Link>
        );
      })}
    </div>
  );
};

export default ActivityTab;
