import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useBattleStore from "@/store/battleStore";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { addNotification } = useBattleStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true, // Send cookies automatically
    });

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
    });

    socketInstance.on("battleNotification", (notification) => {
      console.log("Received battle notification:", notification);
      addNotification(notification);
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