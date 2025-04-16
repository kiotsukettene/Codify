import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calendar, Clock, FileText, Trophy, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function EventHoverCard({ event }) {
  const isCompleted = event.event.extendedProps?.completed || false;
  const priority = event.event.extendedProps?.priority || "low";

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Zap className="h-4 w-4 text-white" />;
      case "medium":
        return <Star className="h-4 w-4 text-white" />;
      default:
        return <Clock className="h-4 w-4 text-white" />;
    }
  };

  // Format the time range
  const formatTimeRange = (start, end) => {
    const startTime = start
      ? start.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "No Start Time";

    const endTime = end
      ? end.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "No End Time";

    return `${startTime} - ${endTime}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="group relative w-full max-w-full truncate">
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 border-md transition-all duration-300 truncate",
              "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
              "border border-transparent hover:border-white",
              "backdrop-blur-sm bg-opacity-90 min-w-0",
              isCompleted ? "opacity-75" : "opacity-100"
            )}
            style={{
              backgroundColor: event.event.backgroundColor,
              background: `linear-gradient(135deg, ${event.event.backgroundColor} 0%, rgba(255,255,255,0.1) 100%)`,
            }}
          >
            <div className="flex items-center gap-1.5 min-w-0 w-full text-white">
              {getPriorityIcon(priority)}
              <span className="font-medium text-xs whitespace-nowrap">
                {event.timeText}
              </span>
              <span className="truncate text-sm flex-1 overflow-hidden text-ellipsis max-w-[120px]">
                {event.event.title}
              </span>

              {isCompleted && (
                <Trophy className="h-4 w-4 text-white animate-pulse flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="min-w-[320px] max-w-[500px] p-4 backdrop-blur-md bg-white/95 border border-blue-100 shadow-lg"
        sideOffset={5}
      >
        <div className="flex flex-col gap-4">
          {/*==================== Header Title ============== */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base leading-tight break-words whitespace-normal max-w-[320px]">
              {event.event.title}
            </h3>

          </div>

          {/* ===================Date and Time ====================*/}
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-md">
              <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">
                {event.event.start.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-purple-50/50 p-2 rounded-md">
              <Clock className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700">
                {formatTimeRange(event.event.start, event.event.end)}
              </span>
            </div>
          </div>

          <Separator className="bg-blue-100/50" />

         
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}