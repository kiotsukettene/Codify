import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useBattleStore from "@/store/battleStore";
import toast from "react-hot-toast";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { addNotification } = useBattleStore();
  const [socket, setSocket] = useState(null);

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    // Get token from cookie
    const token = getCookie("token");

    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      auth: { token }
    });

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
    });

    socketInstance.on("battleNotification", (notification) => {
      console.log("Received battle notification:", notification);
      addNotification(notification);
    });

    socketInstance.on("playerJoined", ({ battleId, studentId, message }) => {
      console.log("Player joined:", message);
      toast.success(message);
    });

    socketInstance.on("opponentJoined", ({ battleId, studentId, message }) => {
      console.log("Opponent joined:", message);
      toast.success(message);
    });

    socketInstance.on("battleCompleted", ({ winnerId, winnerName }) => {
      console.log("Battle completed. Winner:", winnerName);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    setSocket(socketInstance);

    return () => {
      console.log("Disconnecting Socket.IO");
      socketInstance.disconnect();
    };
  }, [addNotification]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};