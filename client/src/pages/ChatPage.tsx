import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { Terminal, ShieldAlert, Send, User, LogIn, Lock } from "lucide-react";

interface Message {
    sender: "user" | "agent";
    content: string;
    timestamp: Date;
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

    const token = localStorage.getItem("logisec_token");
    const isLoggedIn = !!token;

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(window.atob(base64));
            return payload.id || null;
        } catch (e) {
            return null;
        }
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!socket) return;

        // Listen for streaming AI answers returning from port 5001
        socket.on(
            "receive_message",
            (data: { sessionId: string; content: string }) => {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        sender: "agent",
                        content: data.content,
                        timestamp: new Date(),
                    },
                ]);
                if (data.sessionId) setCurrentSessionId(data.sessionId);
                setLoading(false);
            },
        );

        socket.on("error", (err: { message: string }) => {
            console.error("Socket system exception:", err.message);
            setLoading(false);
        });

        return () => {
            socket.off("receive_message");
            socket.off("error");
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || loading || !socket) return;

        const userPrompt = message;
        setMessage("");
        setLoading(true);

        setChatHistory((prev) => [
            ...prev,
            { sender: "user", content: userPrompt, timestamp: new Date() },
        ]);

        socket.emit("send_message", {
            message: userPrompt,
            sessionId: currentSessionId,
            userId: userId, // Automatically null if operating as a guest
        });
    };

    return (
        <div className="flex h-screen w-screen flex-col bg-slate-950 font-mono text-slate-200 overflow-hidden">
            <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Terminal className="h-5 w-5 text-emerald-400 animate-pulse" />
                    <h1 className="text-sm font-bold tracking-widest text-slate-100">
                        LOGISEC // ENGINE V2
                    </h1>
                    <span
                        className={`text-[10px] rounded px-1.5 py-0.5 border ${
                            isLoggedIn
                                ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                                : "bg-amber-950/40 border-amber-800 text-amber-400"
                        }`}
                    >
                        {isLoggedIn
                            ? "AUTHENTICATED_SECURE_MODE"
                            : "GUEST_UNSAVED_MODE"}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/profile"
                                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                                <User className="h-4 w-4" /> Audit Logs Portal
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("logisec_token");
                                    window.location.reload();
                                }}
                                className="text-xs text-rose-400 hover:underline"
                            >
                                Disconnect
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition-all font-semibold tracking-wide"
                        >
                            <LogIn className="h-3.5 w-3.5" /> Synchronize
                            Account
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center max-w-md mx-auto">
                        <ShieldAlert className="h-10 w-10 mb-3 text-slate-700 stroke-[1.5]" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Threat Matrix Engine Idle
                        </p>
                        <p className="text-[11px] mt-1 text-slate-500 leading-relaxed">
                            {!isLoggedIn && (
                                <span className="text-amber-500/80 block mb-2">
                                    ⚠️ NOTICE: Guest scan records are volatile
                                    and disappear on session teardown. Register
                                    to index audit logs permanently.
                                </span>
                            )}
                            Paste vulnerable source sequences or configuration
                            arrays directly below to execute dynamic risk
                            mitigations.
                        </p>
                    </div>
                ) : (
                    chatHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded border transition-all ${
                                msg.sender === "user"
                                    ? "bg-slate-900/40 border-slate-800 text-slate-300"
                                    : "bg-emerald-950/10 border-emerald-900/30 text-slate-100 shadow-lg shadow-emerald-950/5"
                            }`}
                        >
                            <div
                                className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                                    msg.sender === "user"
                                        ? "text-slate-500"
                                        : "text-emerald-400"
                                }`}
                            >
                                {msg.sender === "user"
                                    ? "// INSPECTION_TARGET_SOURCE"
                                    : "🛡️ LOGISEC_IR_AGENT"}
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed selection:bg-emerald-800/40">
                                {msg.content}
                            </pre>
                        </div>
                    ))
                )}

                {loading && (
                    <div className="p-4 rounded border bg-emerald-950/5 border-emerald-900/20 text-emerald-400/70 text-xs flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <span>
                            ANALYZING THREAT SEVERITY VECTORS VIA
                            GEMINI-2.5-FLASH...
                        </span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="border-t border-slate-900 bg-slate-900/20 p-4 backdrop-blur-sm">
                <form
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto flex gap-3"
                >
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type code snippet or vulnerability audit question here... (Press Enter to execute)"
                        className="flex-1 min-h-[44px] max-h-32 bg-slate-950 rounded border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none resize-none font-mono leading-relaxed shadow-inner"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim() || !socket}
                        className="h-[44px] px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
