"use client";

import { useState } from "react";
import { BellRing, Paperclip, Rocket, Star, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useBattleStore from "@/store/battleStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useStudentStore } from "@/store/studentStore";

export default function NotificationCard() {
  const {
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    dismissNotification,
  } = useBattleStore();
  const { student } = useStudentStore();

  console.log("Notifications in NotificationCard:", notifications);
  console.log("NotificationCard rendered, unread count:", unreadNotifications);

  const navigate = useNavigate();
  const [joining, setJoining] = useState(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "challenge":
        return <Rocket className="h-4 w-4 text-white" />;
      case "reminder":
        return <Zap className="h-4 w-4 text-white" />;
      default:
        return <Paperclip className="h-4 w-4 text-white" />;
    }
  };

  const getIconBgColor = (type) => {
    switch (type) {
      case "challenge":
        return "bg-indigo-500";
      case "reminder":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.battleId) {
      toast.error("No battle associated with this notification.");
      return;
    }
    markNotificationAsRead(notification.id);
    navigate(`/student/code-battle/lobby/${notification.battleId}`);
  };

  const handleJoinBattle = async (battleId, notificationId) => {
    console.log("handleJoinBattle triggered:", { battleId, notificationId, studentId: student?._id });
    if (!battleId) {
      console.error("Invalid battle ID");
      toast.error("Invalid battle ID.");
      return;
    }
    if (!student?._id) {
      console.error("No student logged in");
      toast.error("Please log in to join the battle.");
      navigate("/student/login");
      return;
    }
    setJoining(battleId);
    try {
      console.log("Sending join request to:", `http://localhost:3000/api/battles/join/${battleId}`);
      const response = await axios.post(
        `http://localhost:3000/api/battles/join/${battleId}`,
        {},
        { withCredentials: true }
      );
      console.log("Join response:", response.data);
      markNotificationAsRead(notificationId);
      toast.success("Joined battle successfully!");
      
      // Fetch battle details before navigation
      const battleResponse = await axios.get(
        `http://localhost:3000/api/battles/${battleId}`,
        { withCredentials: true }
      );
      
      // Navigate to battle lobby with battle data
      navigate(`/student/code-battle/lobby/${battleId}`, {
        state: {
          battle: battleResponse.data,
          player1: battleResponse.data.player1,
          player2: battleResponse.data.player2
        }
      });
    } catch (error) {
      console.error("Join battle error:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error,
      });
      const errorMessage = error.response?.data?.message || "Error joining battle";
      toast.error(errorMessage);
      if (errorMessage === "You have already joined this battle") {
        // If already joined, fetch battle details and navigate
        try {
          const battleResponse = await axios.get(
            `http://localhost:3000/api/battles/${battleId}`,
            { withCredentials: true }
          );
          markNotificationAsRead(notificationId);
          navigate(`/student/code-battle/lobby/${battleId}`, {
            state: {
              battle: battleResponse.data,
              player1: battleResponse.data.player1,
              player2: battleResponse.data.player2
            }
          });
        } catch (fetchError) {
          console.error("Error fetching battle details:", fetchError);
          toast.error("Error loading battle details");
        }
      }
    } finally {
      setJoining(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 relative bg-violet-100 border-violet-200 hover:bg-violet-200"
        >
          <BellRing className="h-4 w-4 text-violet-600" />
          {unreadNotifications > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center shadow-md"
            >
              {unreadNotifications}
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
            onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
            disabled={notifications.length === 0}
          >
            Mark all as read
          </Button>
        </div>

        <ScrollArea className="h-[300px] bg-violet-50">
          <AnimatePresence>
            {notifications.length > 0 ? (
              <div className="space-y-2 p-2">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className={`relative overflow-hidden border border-violet-200 ${
                        notification.read ? "opacity-80" : "opacity-100 shadow-sm"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full ${getIconBgColor(
                              notification.type
                            )} p-1.5 flex items-center justify-center shadow-md`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-gray-800">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-1 -mt-1 text-gray-400 hover:text-gray-600 hover:bg-violet-200 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>

                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>

                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{notification.time}</span>

                              {notification.type === "challenge" && (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs px-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinBattle(notification.battleId, notification.id);
                                  }}
                                  disabled={joining === notification.battleId}
                                >
                                  {joining === notification.battleId ? "Joining..." : "Join Battle"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
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
          <Button
            variant="ghost"
            size="sm"
            className="w-full bg-violet-200 text-violet-700 hover:bg-violet-300"
            disabled={notifications.length === 0}
          >
            View All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}