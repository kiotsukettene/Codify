import React, { useState, useRef, useEffect } from "react";
import { BellRing, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import badge from "@/assets/picture/achievements/sampleBadge.png";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStudentStore } from "@/store/studentStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import NotificationCard from "./notification-card";
import SupportPanel from "./student-panel";



function StudentHeader() {
  const { logout } = useStudentStore()
  const navigate = useNavigate();
  const [isSupportOpen, setIsSupportOpen] = useState(false)


  const handleLogout = async () => {
    await logout(); // ✅ Call the store logout function
    toast.success("Logged out successfully!");
    navigate("/student/login", { replace: true }); // ✅ Now this works
};
 
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex item">
      </div>
      <div
        className="flex gap-3 items-center md:flex md:items-center z-[-1] md:z-auto md:static 
      absolute top-0 right-0 p-4 md:space-x-4 lg:space-x-0"
      >
        {/* Notifications */}
        <div>
         <NotificationCard/>
        </div>

        {/* Achievement Badge */}
        <div>
          <img className="w-8 h-8" src={badge} alt="Badge" />
        </div>
   
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
               
                <div>
                  <Avatar>
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/student/account-settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSupportOpen(true)}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>


      </div>
      <SupportPanel isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

    </div>
  );
}
export default StudentHeader;