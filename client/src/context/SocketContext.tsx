import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

// Grab your live Render backend URL (e.g., https://logisec-backend.onrender.com)
const SOCKET_URL =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";

// Clean the URL to ensure it plays nice with socket.io expectations
const pcUrl = SOCKET_URL.replace(/^http/, "ws");

export const socket = io(pcUrl, {
    // 🚨 CRITICAL FOR RENDER: Force WebSocket transport immediately
    // instead of polling, which often gets blocked by cloud proxies
    transports: ["websocket"],
    secure: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

// 1. Ensure your context is created
export const SocketContext = createContext<Socket | null>(null);

// 2. Add and EXPORT the missing useSocket hook 🚨
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
