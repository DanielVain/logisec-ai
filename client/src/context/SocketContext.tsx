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
