"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Calendar, Clock, Trophy, Star, Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function EventHoverCard({ event }) {
  const isCompleted = event.event.extendedProps?.completed || false
  const priority = event.event.extendedProps?.priority || "low"

  // Add CSS to fix z-index issues when component mounts
  useEffect(() => {
    // Add styles to ensure proper z-index for calendar elements
    const style = document.createElement("style")
    style.innerHTML = `
      .fc-event {
        position: relative;
        z-index: 1;
      }
      .fc-event:hover {
        z-index: 100 !important;
      }
      .fc-daygrid-event-harness {
        position: relative;
        z-index: 1;
      }
      .fc-daygrid-event-harness:hover {
        z-index: 100 !important;
      }
      .fc-view-harness {
        overflow: visible !important;
      }
      .fc-scrollgrid-sync-inner {
        position: relative;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Zap className="h-4 w-4 text-white" />
      case "medium":
        return <Star className="h-4 w-4 text-white" />
      default:
        return <Clock className="h-4 w-4 text-white" />
    }
  }

  // Format the time range
  const formatTimeRange = (start, end) => {
    const startTime = start
      ? start.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "No Start Time"
    const endTime = end
      ? end.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "No End Time"
    return `${startTime} - ${endTime}`
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="group relative w-full max-w-full truncate"
          style={{ position: "relative", zIndex: 1 }}
          onMouseEnter={(e) => {
            // Dynamically increase z-index on hover
            e.currentTarget.style.zIndex = "100"

            // Find parent event harness and increase its z-index too
            const parentHarness = e.currentTarget.closest(".fc-daygrid-event-harness")
            if (parentHarness) {
              parentHarness.style.zIndex = "100"
            }
          }}
          onMouseLeave={(e) => {
            // Reset z-index on mouse leave
            e.currentTarget.style.zIndex = "1"

            // Reset parent harness z-index too
            const parentHarness = e.currentTarget.closest(".fc-daygrid-event-harness")
            if (parentHarness) {
              parentHarness.style.zIndex = "1"
            }
          }}
        >
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 border-md transition-all duration-300 truncate",
              "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
              "border border-transparent hover:border-white",
              isCompleted ? "opacity-75" : "opacity-100",
            )}
            style={{
              backgroundColor: event.event.backgroundColor,
              background: `linear-gradient(135deg, ${event.event.backgroundColor} 0%, rgba(255,255,255,0.1) 100%)`,
              position: "relative",
            }}
          >
            <div className="flex items-center gap-1.5 min-w-0 w-full text-white">
              {getPriorityIcon(priority)}
              <span className="font-medium text-xs whitespace-nowrap">{event.timeText}</span>
              <span className="truncate text-sm flex-1 overflow-hidden text-ellipsis max-w-[120px]">
                {event.event.title}
              </span>
              {isCompleted && <Trophy className="h-4 w-4 text-white animate-pulse flex-shrink-0" />}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="min-w-[320px] max-w-[500px] p-4 backdrop-blur-md bg-white/95 border border-blue-100 shadow-lg"
        sideOffset={5}
        align="start"
        style={{
          zIndex: 9999, // Very high z-index to ensure it's above everything
          position: "relative",
          pointerEvents: "auto",
        }}
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
              <span className="text-gray-700">{formatTimeRange(event.event.start, event.event.end)}</span>
            </div>
          </div>

          <Separator className="bg-blue-100/50" />
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
