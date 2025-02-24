import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calendar, Clock, FileText, Trophy, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function EventHoverCard({ event }) {
  // Get completion status from event (assuming it's in extendedProps)
  const isCompleted = event.event.extendedProps?.completed || false;
  const priority = event.event.extendedProps?.priority || "low";

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Zap className="h-4 w-4 text-red-200" />;
      case "medium":
        return <Star className="h-4 w-4 text-amber-200" />;
      default:
        return <Clock className="h-4 w-4 text-emerald-100" />;
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
            "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:scale-105",
            "border border-transparent hover:border-blue-200",
            "backdrop-blur-sm bg-opacity-90",
            isCompleted ? "opacity-75" : "opacity-100"
          )}
          style={{
            backgroundColor: event.event.backgroundColor,
            background: `linear-gradient(135deg, ${event.event.backgroundColor} 0%, rgba(255,255,255,0.1) 100%)`,
          }}
        >
          <div className="flex items-center gap-2 text-white">
            {getPriorityIcon(priority)}
            <span className="font-medium">{event.timeText}</span>
            <span className="truncate">{event.event.title}</span>
            {isCompleted && (
              <Trophy className="h-4 w-4 text-white animate-pulse" />
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 backdrop-blur-md bg-white/90 border border-blue-100 shadow-lg">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {event.event.title}
              {getPriorityIcon(priority)}
            </h3>

            {/* Progress indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{isCompleted ? "100%" : "0%"}</span>
              </div>
              <Progress value={isCompleted ? 100 : 0} className="h-1" />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-md">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {event.event.start.toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-purple-50/50 p-2 rounded-md">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                {event.event.start
                  ? event.event.start.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "No Start Time"}
                {" - "}
                {event.event.end
                  ? event.event.end.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "No End Time"}
              </span>
            </div>

            {event.event.notes && (
              <div className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-md">
                <FileText className="h-4 w-4 text-emerald-600 mt-0.5" />
                <span className="text-sm">{event.event.notes}</span>
              </div>
            )}
          </div>

          <Separator className="bg-blue-100" />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-blue-50 transition-colors"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white bg-emerald-600 hover:bg-emerald-500 hover:text-white border-0"
              onClick={() => {
                // Handle completion toggle
                event.event.setExtendedProp("completed", !isCompleted);
              }}
            >
              {isCompleted ? "Completed ✨" : "Mark Complete"}
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
