import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const isDev = import.meta.env.MODE === "development";
const API_URL = isDev
  ? "http://localhost:3000/api/battles"
  : `${import.meta.env.VITE_API_URL}/api/battles`;

export default function NotificationCard({ notification, onClose }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinBattle = async () => {
    setIsLoading(true);
    try {
      // Extract the battleId from the notification - handle both direct and nested cases
      const battleId = notification.battleId || (notification[2] && notification[2].battleId);
      
      if (!battleId) {
        console.error("No battle ID found in notification:", notification);
        return;
      }

      console.log("handleJoinBattle triggered:", { 
        notification,
        battleId, 
        notificationId: notification.id 
      });

      // First try to join the battle
      try {
        const joinResponse = await axios.post(
          `${API_URL}/join/${battleId}`,
          {},
          { withCredentials: true }
        );
        console.log("Join response:", joinResponse.data);
      } catch (joinError) {
        console.log("Join response error (expected if already joined):", joinError.response?.data);
      }

      // Navigate to the battle lobby with the correct battleId
      navigate(`/student/code-battle/lobby/${battleId}`, { replace: true });
      
      // Mark notification as read
      if (notification.id) {
        await axios.patch(
          `${API_URL}/notifications/${notification.id}`,
          { read: true },
          { withCredentials: true }
        );
      }

    } catch (error) {
      console.error("Error in handleJoinBattle:", error);
      console.log("Full notification object:", notification);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle array-style notifications
  const notificationTitle = Array.isArray(notification) ? notification[2]?.title : notification.title;
  const notificationMessage = Array.isArray(notification) ? notification[2]?.message : notification.message;
  const notificationType = Array.isArray(notification) ? notification[2]?.type : notification.type;
  const notificationTime = Array.isArray(notification) ? notification[2]?.time : notification.time;
  const notificationRead = Array.isArray(notification) ? notification[2]?.read : notification.read;

  return (
    <div className="bg-[#1A1625]/50 border border-purple-900/50 rounded-lg p-4 mb-2 relative">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Bell className="h-5 w-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white">{notificationTitle}</h3>
          <p className="text-sm text-gray-400">{notificationMessage}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{notificationTime}</span>
            {notificationType === "challenge" && !notificationRead && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-sm"
                onClick={handleJoinBattle}
                disabled={isLoading}
              >
                Join Battle
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          onClick={() => onClose(notification.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 