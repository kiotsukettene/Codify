import React, { useState, useRef, useEffect } from "react";
import SearchForm from "./SearchForm";
import { BellRing, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import badge from "../../assets/picture/achievements/sampleBadge.png";
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


function StudentHeader() {
  const { logout } = useStudentStore()
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // ✅ Call the store logout function
    toast.success("Logged out successfully!");
    navigate("/student/login", { replace: true }); // ✅ Now this works
};

 
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex item">
        <SearchForm />
      </div>

      <div
        className="flex gap-3 items-center md:flex md:items-center z-[-1] md:z-auto md:static 
      absolute top-0 right-0 p-4 md:space-x-4 lg:space-x-0"
      >
        {/* Notifications */}
        <div>
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
            <BellRing className="h-4 w-4" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
              1
            </span>
          </Button>
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
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        
      </div>
    </div>
  );
}

export default StudentHeader;
