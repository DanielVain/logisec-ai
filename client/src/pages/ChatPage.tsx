import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import toast, { Toaster } from "react-hot-toast";

// Component Catalog Imports
import { MobileHeader } from "../components/chat/MobileHeader";
import { Sidebar } from "../components/chat/Sidebar";
import { MessageItem } from "../components/chat/MessageItem";
import { ChatIntro } from "../components/chat/ChatIntro";
import { MessageSkeleton } from "../components/chat/MessageSkeleton";
import { ChatInput } from "../components/chat/ChatInput";

interface Message {
    sender: "user" | "agent";
    content: string;
}

export default function ChatPage() {
    const socket = useSocket();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const token = localStorage.getItem("logisec_token");
    const isLoggedIn = !!token;

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            return JSON.parse(window.atob(token.split(".")[1])).id || null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on(
            "receive_message",
            (data: { sessionId: string; content: string }) => {
                setChatHistory((prev) => [
                    ...prev,
                    { sender: "agent", content: data.content },
                ]);
                if (data.sessionId) setCurrentSessionId(data.sessionId);
                setLoading(false);
            },
        );

        // Pipeline Compilation Error
        socket.on("error", (err: { message: string }) => {
            setLoading(false); // 🚨 Fix: Instantly kill loading skeletons
            toast.error(
                err.message || "Vulnerability pipeline compilation failed.",
                { id: "socket-error" },
            );
        });

        // Gateway Level Disconnect (Server drops out entirely)
        socket.on("disconnect", (reason) => {
            setLoading(false); // 🚨 Fix: Kill the loading state so inputs reopen
            if (
                reason === "io server disconnect" ||
                reason === "transport close"
            ) {
                toast.error(
                    "Security gateway connection dropped. Reconnecting...",
                    {
                        id: "gateway-drop",
                        icon: "⚠️",
                    },
                );
            }
        });

        // Catch low-level connection timeout errors
        socket.on("connect_error", () => {
            setLoading(false);
            toast.error("Failed to re-establish secure socket pipeline.", {
                id: "conn-timeout",
            });
        });

        return () => {
            socket.off("receive_message");
            socket.off("error");
            socket.off("disconnect");
            socket.off("connect_error");
        };
    }, [socket]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        if (!socket || !socket.connected) {
            toast.error(
                "Action Aborted: Analysis pipeline is currently offline.",
                { icon: "🚫" },
            );
            return;
        }

        const userText = message;
        setMessage("");
        setLoading(true);
        setChatHistory((prev) => [
            ...prev,
            { sender: "user", content: userText },
        ]);

        socket.emit("send_message", {
            message: userText,
            sessionId: currentSessionId,
            userId: getUserIdFromToken(),
        });
    };

    return (
        <div className="flex h-screen w-screen bg-[#090d16] font-sans text-slate-200 overflow-hidden antialiased relative">
            <MobileHeader
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                isLoggedIn={isLoggedIn}
                isSocketConnected={!!socket?.connected}
                onLogout={() => {
                    localStorage.removeItem("logisec_token");
                    navigate(0);
                }}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0c1220]/20 pt-14 lg:pt-0">
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-5xl mx-auto w-full">
                    {chatHistory.length === 0 ? (
                        <ChatIntro />
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <MessageItem key={idx} msg={msg} />
                        ))
                    )}
                    {loading && <MessageSkeleton />}
                    <div ref={messagesEndRef} />
                </div>

                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    loading={loading}
                    onSubmit={handleSendMessage}
                />
            </main>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#0c1220",
                        color: "#f1f5f9",
                        border: "1px solid rgba(244, 63, 94, 0.2)",
                        borderRadius: "12px",
                        fontSize: "13px",
                    },
                }}
            />
        </div>
    );
}
