import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Clean the environment URL for secure WebSocket connections
const SOCKET_URL =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
const wsUrl = SOCKET_URL.replace(/^http/, "ws");

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
    children: React.ReactNode;
}

// 🚨 EXPORTED NAMED COMPONENT: Matches your main.tsx import exactly
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(wsUrl, {
            transports: ["websocket"],
            secure: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// 🚨 EXPORTED NAMED HOOK: Matches your ChatPage.tsx import exactly
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
