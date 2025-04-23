import React from "react";
import { Link } from "react-router-dom";
import { Home, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import notfound from "@/assets/picture/random-background/notfound.png";
import { motion } from "framer-motion";


function PageNotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B1E] overflow-hidden relative flex items-center justify-center">
      {/* Stars background */}
      <div className="stars absolute inset-0" />

      {/* Content container */}
      <div
        className="relative z-10 text-center"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* Glowing 404 */}
        <h1 className="text-9xl font-bold text-white mb-8 animate-pulse">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            404
          </span>
        </h1>

        {/* Astronaut SVG */}
        <div className="w-48 h-48 mx-auto mb-8 animate-float">
          <img src={notfound} alt="Lost Astronaut" className="w-full h-full" />
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 animate-glow">
        Lost in Space! This page doesn’t exist.
        </h2>
        <p className="text-purple-200 mb-8 max-w-md mx-auto">
        It looks like this page is a black hole of lost links. But don't worry, we can warp you back to safety!
        </p>

        {/* Return Home Button */}

        <Link to={"/"}>
      
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <button className="group relative px-8 py-4 text-lg font-medium bg-white text-gray-900 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Back to home
                <Sparkles className="ml-2 w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

           
          </motion.div>

        </Link>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .stars {
          background: radial-gradient(
            circle at center,
            #0b0b1e 0%,
            #000000 100%
          );
        }
        .stars::before {
          content: "";
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          box-shadow: ${Array(100)
              .fill()
              .map(() => {
                const x = Math.floor(Math.random() * 100);
                const y = Math.floor(Math.random() * 100);
                return `${x}vw ${y}vh #fff,`;
              })
              .join("")}
            50vw 50vh #fff;
          animation: twinkle 5s infinite;
        }
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.3;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
          0% {
            text-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          100% {
            text-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default PageNotFoundPage;
