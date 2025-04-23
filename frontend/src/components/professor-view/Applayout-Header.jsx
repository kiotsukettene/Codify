import React, { useState, useRef, useEffect } from "react";
import { BellRing, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useprofAuthStore } from "@/store/profAuthStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

function ProfessorHeader() {
  const { logoutProfessor } = useprofAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState({
    scheduledBattles: [
      { id: 1, title: "Web Dev Battle", time: "Tomorrow 10 AM", isRead: false },
    ],
    activeBattles: [
      { id: 2, title: "Data Structures Duel", remaining: "30 mins left", isRead: false },
    ],
    gradingTasks: [
      { id: 3, title: "Assignment 1", course: "Intro to Programming", isRead: false },
      { id: 4, title: "Quiz 2", course: "Web Development", isRead: false },
    ],
  });

  const totalNotifications =
    notifications.scheduledBattles.length +
    notifications.activeBattles.length +
    notifications.gradingTasks.length;

  const unreadNotifications =
    notifications.scheduledBattles.filter((n) => !n.isRead).length +
    notifications.activeBattles.filter((n) => !n.isRead).length +
    notifications.gradingTasks.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    await logoutProfessor();
    toast.success("Logged out successfully!");
    navigate("/professor/login", { replace: true });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleNotificationClick = (notification, category) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: prev[category].map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => ({
      scheduledBattles: prev.scheduledBattles.map((n) => ({ ...n, isRead: true })),
      activeBattles: prev.activeBattles.map((n) => ({ ...n, isRead: true })),
      gradingTasks: prev.gradingTasks.map((n) => ({ ...n, isRead: true })),
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end items-center w-full">
      <div
        className="gap-3 flex items-center md:static 
       top-0 justify-end pr-4 md:space-x-4 lg:space-x-0"
      >
        <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 relative"
              onClick={toggleNotifications}
            >
              <BellRing className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mr-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-purple-600 leading-none">Notifications</h4>
                  {unreadNotifications > 0 && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-xs text-purple-600 hover:text-purple-800"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recent updates and pending tasks.
                </p>
              </div>
              <Separator />
              <div className="grid gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.scheduledBattles.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold mb-1">Scheduled Battles</h5>
                    {notifications.scheduledBattles.map((battle) => (
                      <Button
                        key={battle.id}
                        variant="ghost"
                        className={`w-full text-left text-sm p-2 rounded justify-start ${
                          battle.isRead
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-purple-50"
                        }`}
                        onClick={() => handleNotificationClick(battle, "scheduledBattles")}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-1">
                            <p className={`font-medium ${battle.isRead ? "text-gray-600" : "text-gray-900"}`}>
                              {battle.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{battle.time}</p>
                          </div>
                          {!battle.isRead && (
                            <div className="h-2 w-2 rounded-full bg-purple-600" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {notifications.activeBattles.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold mb-1">Active Battles</h5>
                    {notifications.activeBattles.map((battle) => (
                      <Button
                        key={battle.id}
                        variant="ghost"
                        className={`w-full text-left text-sm p-2 rounded justify-start ${
                          battle.isRead
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-purple-50"
                        }`}
                        onClick={() => handleNotificationClick(battle, "activeBattles")}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-1">
                            <p className={`font-medium ${battle.isRead ? "text-gray-600" : "text-gray-900"}`}>
                              {battle.title}
                            </p>
                            <p className="text-xs text-destructive">{battle.remaining}</p>
                          </div>
                          {!battle.isRead && (
                            <div className="h-2 w-2 rounded-full bg-purple-600" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {notifications.gradingTasks.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold mb-1">To Grade</h5>
                    {notifications.gradingTasks.map((task) => (
                      <Button
                        key={task.id}
                        variant="ghost"
                        className={`w-full text-left text-sm p-2 rounded justify-start ${
                          task.isRead
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-purple-50"
                        }`}
                        onClick={() => handleNotificationClick(task, "gradingTasks")}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-1">
                            <p className={`font-medium ${task.isRead ? "text-gray-600" : "text-gray-900"}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{task.course}</p>
                          </div>
                          {!task.isRead && (
                            <div className="h-2 w-2 rounded-full bg-purple-600" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {totalNotifications === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No new notifications.
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <Avatar>
              <AvatarImage
                className="w-8 h-8 rounded-full cursor-pointer"
                src="https://github.com/shadcn.png"
                alt="Professor Avatar"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-50">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessorHeader;