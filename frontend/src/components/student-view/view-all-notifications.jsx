
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Rocket, Zap, Paperclip, BellRing, CheckCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ViewAllNotifications = ({
  isOpen,
  onClose,
  notifications = [],
  markNotificationAsRead,
  dismissNotification,
  handleJoinBattle,
  handleNotificationClick,
  isLoading,
  joining,
}) => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [selectedNotification, setSelectedNotification] = useState(null)

  // Filter notifications based on tab and search query
  useEffect(() => {
    let filtered = [...notifications]

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.read)
    } else if (activeTab === "challenges") {
      filtered = filtered.filter((notification) => notification.type === "challenge")
    } 

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query),
      )
    }

    setFilteredNotifications(filtered)
  }, [activeTab, searchQuery, notifications])

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "challenge":
        return <Rocket className="h-5 w-5 text-white" />
      case "reminder":
        return <Zap className="h-5 w-5 text-white" />
      default:
        return <Paperclip className="h-5 w-5 text-white" />
    }
  }

  // Get icon background color based on type
  const getIconBgColor = (type) => {
    switch (type) {
      case "challenge":
        return "bg-indigo-500"
      case "reminder":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle notification selection for detailed view
  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification)
  }

  // Format date for detailed view
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Count notifications by type
  const challengeCount = notifications.filter((n) => n.type === "challenge").length
  const reminderCount = notifications.filter((n) => n.type === "reminder").length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">All Notifications</h2>
              <p className="text-sm text-violet-200">
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-violet-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                className="pl-9 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs px-3 py-1">
                  All
                  <Badge className="ml-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {notifications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs px-3 py-1">
                  Unread
                  <Badge className="ml-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    {unreadCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="challenges" className="text-xs px-3 py-1">
                  Challenges
                  <Badge className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {challengeCount}
                  </Badge>
                </TabsTrigger>
                
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notification list */}
          <div className={`flex-1 ${selectedNotification ? "hidden md:block" : ""}`}>
            <ScrollArea className="h-[calc(90vh-180px)]">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-2 p-4">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                        onClick={() => handleSelectNotification(notification)}
                      >
                        <Card
                          className={`relative overflow-hidden border ${
                            notification.read
                              ? "border-gray-200 dark:border-gray-700"
                              : "border-violet-300 dark:border-violet-700 shadow-md"
                          } ${
                            selectedNotification?.id === notification.id
                              ? "bg-violet-50 dark:bg-violet-900/30 border-violet-400 dark:border-violet-600"
                              : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full ${getIconBgColor(
                                  notification.type,
                                )} p-2 flex items-center justify-center shadow-md`}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="inline-block ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                  </h4>
                                  <div className="flex gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          markNotificationAsRead(notification.id)
                                        }}
                                      >
                                        <CheckCircle className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        dismissNotification(notification.id)
                                      }}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-500">{notification.time}</span>

                                  {notification.type === "challenge" && !notification.read && (
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs px-3 bg-indigo-500 hover:bg-indigo-600 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleJoinBattle(notification)
                                      }}
                                      disabled={joining === notification.battleCode || isLoading}
                                    >
                                      {isLoading && joining === notification.battleCode ? "Joining..." : "Join Battle"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full mb-4">
                    <Star className="h-10 w-10 text-violet-500 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    No notifications found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                    {searchQuery
                      ? "Try adjusting your search"
                      : activeTab !== "all"
                        ? `No ${activeTab} notifications available`
                        : "You're all caught up!"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Notification detail view */}
          {selectedNotification && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-1/2 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notification Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setSelectedNotification(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(90vh-180px)] p-4">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full ${getIconBgColor(
                      selectedNotification.type,
                    )} p-3 flex items-center justify-center shadow-md`}
                  >
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{selectedNotification.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedNotification.time} • {selectedNotification.read ? "Read" : "Unread"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">{selectedNotification.message}</p>
                  </div>

                  {selectedNotification.type === "challenge" && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                      <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Battle Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Battle Code:</span>
                          <span className="text-sm font-mono bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded">
                            {selectedNotification.battleCode || "N/A"}
                          </span>
                        </div>
                        {selectedNotification.expiresAt && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                            <span className="text-sm">{formatDate(selectedNotification.expiresAt)}</span>
                          </div>
                        )}
                      </div>

                      {!selectedNotification.read && (
                        <Button
                          className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                          onClick={() => handleJoinBattle(selectedNotification)}
                          disabled={joining === selectedNotification.battleCode || isLoading}
                        >
                          {isLoading && joining === selectedNotification.battleCode ? "Joining..." : "Join Battle"}
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                      onClick={() => {
                        markNotificationAsRead(selectedNotification.id)
                        setSelectedNotification({ ...selectedNotification, read: true })
                      }}
                      disabled={selectedNotification.read}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Read
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => {
                        dismissNotification(selectedNotification.id)
                        setSelectedNotification(null)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredNotifications.length} {filteredNotifications.length === 1 ? "notification" : "notifications"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
              onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark All as Read
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ViewAllNotifications
