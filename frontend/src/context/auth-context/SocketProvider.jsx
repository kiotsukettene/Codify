import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useBattleStore from "@/store/battleStore";
import toast from "react-hot-toast";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { addNotification } = useBattleStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("token") || document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1]
      }
    });

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
    });

    socketInstance.on("battleNotification", (notification) => {
      console.log("Received battle notification:", notification);
      addNotification(notification);
      toast.success(notification.message);
    });

    socketInstance.on("playerJoined", ({ battleId, studentId, message }) => {
      console.log("Player joined:", message);
      toast.success(message);
    });

    socketInstance.on("opponentJoined", ({ battleId, studentId, message }) => {
      console.log("Opponent joined:", message);
      toast.success(message);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      toast.error("Connection error, please refresh");
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