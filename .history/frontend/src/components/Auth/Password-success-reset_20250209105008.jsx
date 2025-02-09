import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function PasswordResetSuccess({ navigateTo }) {
  const navigate = useNavigate();
  useEffect(() => {
    // Add stars to background
    const createStar = () => {
      const star = document.createElement("div");
      star.className = "absolute bg-white rounded-full animate-twinkle";
      star.style.width = "2px";
      star.style.height = "2px";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      return star;
    };

    const bg = document.getElementById("starry-bg");
    for (let i = 0; i < 50; i++) {
      bg.appendChild(createStar());
    }

    return () => {
      while (bg.firstChild) {
        bg.removeChild(bg.firstChild);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 overflow-hidden">
      <div id="starry-bg" className="absolute inset-0" />

      {/* Success Card */}
      <div className="relative w-full max-w-md space-y-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center text-white">
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 animate-pulse bg-purple-500 rounded-full opacity-25" />
          <div className="relative flex items-center justify-center w-full h-full bg-purple-600 rounded-full">
            <svg
              className="w-12 h-12 text-white animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Mission Accomplished! 🚀
          </h1>
          <p className="text-lg text-purple-200">
            Your password has been successfully reset
          </p>
          <p className="text-sm text-purple-300">
            Welcome back, space explorer! You can now log in and continue your
            journey.
          </p>
        </div>

        <Button
          onClick={() => navigate(navigateTo)}
          className="w-full bg-purple-600 hover:bg-purple-500 hover:scale-105 transform transition-all duration-200 text-white border-2 border-purple-400/20"
        >
          Return to Login
        </Button>

        {/* Floating Astronaut */}
        <div className="absolute -right-8 -top-8 w-24 h-24 opacity-50 animate-float">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M21.97 13.52v-.02c0-.13-.07-.25-.17-.33l-3.76-2.82c-.11-.08-.25-.11-.38-.08l-4.06.89c-.13.03-.24.12-.29.24l-1.74 4.08c-.05.12-.05.26.02.38l2.44 4.1c.08.13.22.21.37.21h.02c.15-.01.29-.1.36-.23l1.67-3.93c.07-.17.27-.25.44-.17l3.17 1.59c.17.09.25.29.17.46l-2.1 4.94c-.08.19.01.4.2.48.19.08.4-.01.48-.2l2.29-5.4c.05-.11.05-.24 0-.35l-2.41-4.38c-.07-.12-.19-.2-.32-.21l-4.12-.29c-.13-.01-.27.05-.35.16l-2.1 2.81c-.09.12-.11.27-.05.41l1.61 3.87c.08.19.3.27.48.19.19-.08.27-.3.19-.48l-1.46-3.51c-.02-.06-.03-.12-.01-.18l1.81-2.42c.02-.03.06-.05.1-.05l3.87.27c.04 0 .08.03.09.06l2.29 4.16c.02.04.02.08 0 .12l-1.64 3.88c-.02.04-.06.07-.1.07s-.08-.03-.1-.07l-2.23-3.75c-.02-.04-.03-.08-.02-.12l1.63-3.83c.02-.04.06-.07.1-.08l3.81-.84c.04-.01.08 0 .11.02l3.53 2.65c.03.02.04.06.04.09v4.94c0 .04-.02.08-.06.1l-3.52 2.21c-.04.02-.08.02-.12 0l-3.83-1.92c-.04-.02-.06-.06-.06-.1v-4.04c0-.04.02-.08.06-.1l3.52-2.21c.04-.02.08-.02.12 0l3.83 1.92c.04.02.06.06.06.1v.02c0 .21.17.38.38.38s.38-.17.38-.38z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetSuccess;
