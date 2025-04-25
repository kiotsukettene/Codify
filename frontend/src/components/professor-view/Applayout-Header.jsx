import React, { useState, useRef, useEffect } from "react";
import { BellRing, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useprofAuthStore } from "@/store/profAuthStore";

function ProfessorHeader() {
  const { professor, logoutProfessor } = useprofAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logoutProfessor(); 
    toast.success("Logged out successfully!");
    navigate("/professor/login", { replace: true }); 
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
        className="gap-3 flex item md:flex md:items-center z-[-1] md:z-auto md:static 
       top-0 justify-end pr-4 md:space-x-4 lg:space-x-0"
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

        {/* Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <Avatar>
              <AvatarImage
                className="w-8 h-8 rounded-full cursor-pointer"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
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