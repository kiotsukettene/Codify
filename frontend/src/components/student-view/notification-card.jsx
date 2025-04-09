"use client"

import { useState } from "react"
import { Award, BellRing, Paperclip, Rocket, Star, X, Zap} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    type: "challenge",
    title: "New Challenge: 'Geometry Speed Round'",
    message: "Ready to test your skills?",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "reminder",
    title: "Assignment 'Photosynthesis Lab' is due",
    message: "Don't miss it! Due in 1 day.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "badge",
    title: "You unlocked the 'Night Owl' badge!",
    message: "For studying after 10 PM three nights in a row.",
    time: "Yesterday",
    read: true,
    badgeImage: "/placeholder.svg?height=40&width=40",
    xpEarned: 50,
  },
  {
    id: 4,
    type: "challenge",
    title: "New Quiz: 'Algebra Fundamentals'",
    message: "Test your equation-solving skills!",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "badge",
    title: "You unlocked the 'Perfect Score' badge!",
    message: "For scoring 100% on your Math quiz.",
    time: "3 days ago",
    read: true,
    badgeImage: "/placeholder.svg?height=40&width=40",
    xpEarned: 100,
  },
]

export default function NotificationCard() {
  const [notifications, setNotifications] = useState(sampleNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "challenge":
        return "#4f46e5" // indigo
      case "badge":
        return "#9333ea" // purple
      case "reminder":
        return "#f59e0b" // amber
      default:
        return "#6b7280" // gray
    }
  }

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "challenge":
        return <Rocket/>
      case "badge":
        return <Award/>
      case "reminder":
        return <Zap/>
      default:
        return <Paperclip/>
    }
  }

  const getIconBgColor = (type) => {
    switch (type) {
      case "challenge":
        return "bg-indigo-500"
      case "badge":
        return "bg-purple-500"
      case "reminder":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }

    
  }
//   const getIcon = (type) => {
//     switch (type) {
//       case "challenge":
//         return "bg-indigo-500"
//       case "badge":
//         return "bg-purple-500"
//       case "reminder":
//         return "bg-amber-500"
//       default:
//         return "bg-gray-500"
//     }
// }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 relative bg-violet-100 border-violet-200 hover:bg-violet-200"
        >
          <BellRing className="h-4 w-4 text-violet-600" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center shadow-md"
            >
              {unreadCount}
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 border border-violet-200 shadow-lg rounded-lg overflow-hidden"
        align="end"
        sideOffset={5}
      >
        <div className="bg-violet-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-violet-200" />
            <h3 className="font-bold text-lg">Notifications</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-white hover:bg-violet-700 hover:text-white"
            onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
          >
            Mark all as read
          </Button>
        </div>

        <ScrollArea className="h-[300px] bg-violet-50">
          <AnimatePresence>
            {notifications.length > 0 ? (
              <div className="space-y-2 p-2">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    color={getNotificationColor(notification.type)}
                    bgColor={getNotificationBgColor(notification.type)}
                    iconBgColor={getIconBgColor(notification.type)}
                    onDismiss={dismissNotification}
                    markAsRead={markAsRead}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Star className="h-10 w-10 text-violet-300 mb-2" />
                <p className="text-violet-600">All systems clear, Captain!</p>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <div className="p-2 border-t border-violet-200 bg-violet-50">
          <Button variant="ghost" size="sm" className="w-full bg-violet-200 text-violet-700 hover:bg-violet-300">
            View All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({ notification, color, bgColor, iconBgColor, onDismiss, markAsRead }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={() => markAsRead(notification.id)}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={`
        relative overflow-hidden border border-violet-200 ${bgColor}
        ${notification.read ? "opacity-80" : "opacity-100 shadow-sm"}
      `}
      >
        <CardContent className="p-3">
          <div className="flex gap-3">
            {/* Icon with color */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBgColor} p-1.5 flex items-center justify-center shadow-md`}
            >
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-gray-800">{notification.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-1 -mt-1 text-gray-400 hover:text-gray-600 hover:bg-violet-200 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDismiss(notification.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>

              {/* XP for badge notifications */}
              {notification.type === "badge" && notification.xpEarned && (
                <div className="mt-2 flex items-center">
                  <Badge className="bg-amber-200 text-amber-800 border-0 px-2 py-0.5 text-xs font-bold">
                    +{notification.xpEarned} COSMIC XP
                  </Badge>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{notification.time}</span>

                {/* Action buttons based on type */}
                {notification.type === "badge" && (
                  <Button
                    size="sm"
                    className="h-7 text-xs px-2 bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    View Badge
                  </Button>
                )}

                {notification.type === "challenge" && (
                  <Button
                    size="sm"
                    className="h-7 text-xs px-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    Launch
                  </Button>
                )}

                {notification.type === "reminder" && (
                  <Button
                    size="sm"
                    className="h-7 text-xs px-2 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    View All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
