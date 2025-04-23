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
  const { professor, logoutProfessor } = useprofAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = {
    scheduledBattles: [
      { id: 1, title: "Web Dev Battle", time: "Tomorrow 10 AM" },
    ],
    activeBattles: [
      { id: 2, title: "Data Structures Duel", remaining: "30 mins left" },
    ],
    gradingTasks: [
      { id: 3, title: "Assignment 1", course: "Intro to Programming" },
      { id: 4, title: "Quiz 2", course: "Web Development" },
    ],
  };

  const totalNotifications =
    notifications.scheduledBattles.length +
    notifications.activeBattles.length +
    notifications.gradingTasks.length;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derive initials for AvatarFallback
  const initials = professor
    ? `${professor.firstName?.[0] || ""}${
        professor.lastName?.[0] || ""
      }`.toUpperCase()
    : "P";

  return (
    <div className="flex justify-end items-center w-full">
      <div
        className="gap-3 flex items-center md:static 
       top-0 justify-end pr-4 md:space-x-4 lg:space-x-0"
      >
        <Popover
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 relative"
              onClick={toggleNotifications}
            >
              <BellRing className="h-4 w-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mr-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-purple-600 leading-none">
                  Notifications
                </h4>
                <p className="text-sm text-muted-foreground">
                  Recent updates and pending tasks.
                </p>
              </div>
              <Separator />
              <div className="grid gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.scheduledBattles.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold mb-1">
                      Scheduled Battles
                    </h5>
                    {notifications.scheduledBattles.map((battle) => (
                      <Button
                        key={battle.id}
                        variant="ghost" // Use "ghost" to remove default button styling
                        className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded justify-start"
                        onClick={() => handleNotificationClick(battle)} // Add click handler
                      >
                        <div>
                          <p className="font-medium">{battle.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {battle.time}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {notifications.activeBattles.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold mb-1">
                      Active Battles
                    </h5>
                    {notifications.activeBattles.map((battle) => (
                      <Button
                        key={battle.id}
                        variant="ghost"
                        className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded justify-start"
                        onClick={() => handleNotificationClick(battle)}
                      >
                        <div>
                          <p className="font-medium">{battle.title}</p>
                          <p className="text-xs text-destructive">
                            {battle.remaining}
                          </p>
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
                        className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded justify-start"
                        onClick={() => handleNotificationClick(task)}
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.course}
                          </p>
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
              <AvatarFallback className="border-2 w-8 h-8 flex items-center justify-center rounded-full">
                {initials}
              </AvatarFallback>{" "}
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
