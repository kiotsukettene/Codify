"use client";

import { Bell, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function UserMenu() {
  const [isDark, setIsDark] = useState(false);
  const [notifications] = useState(3);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4 max-w-7xl mx-auto">
        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            size="icon"
            className="relative"
            aria-label={`${notifications} notifications`}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <avatar>
            <AvatarImage src="" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </avatar>
        </div>
      </div>
    </header>
  );
}
