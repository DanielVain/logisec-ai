import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import ReactMarkdown from "react-markdown";
import {
    Shield,
    Send,
    User,
    LogIn,
    LogOut,
    Code,
    Layers,
    Radio,
    History,
    ArrowRight,
    CornerDownLeft,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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

    // Responsive Layout & Collapsible Panel States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const token = localStorage.getItem("logisec_token");
    const isLoggedIn = !!token;

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(window.atob(token.split(".")[1]));
            return payload.id || null;
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

        socket.on("error", (err: { message: string }) => {
            console.error(err.message);
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

    // Track window viewports to toggle defensive layout states natively
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || loading || !socket) return;

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
            {/* 📱 MOBILE NAVIGATION HEADER */}
            <header className="lg:hidden absolute top-0 left-0 right-0 h-14 border-b border-slate-800/60 bg-[#0c1220]/80 backdrop-blur-md flex items-center justify-between px-4 z-40 select-none">
                <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
                        LogiSec AI
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>
            </header>

            {/* 📱 MOBILE OVERLAY DRAWER BACKDROP */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 💻 COLLAPSIBLE SIDEBAR PANEL CONSOLE */}
            <aside
                className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-30
        flex flex-col justify-between shrink-0 select-none
        border-r border-slate-800/40 bg-[#0c1220]/95 lg:bg-[#0c1220]/60 backdrop-blur-xl
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-0 lg:w-16"}
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                {/* Desktop Toggle Handle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex absolute top-4 -right-3 h-6 w-6 rounded-full border border-slate-700/60 bg-[#0c1220] items-center justify-center text-slate-400 hover:text-emerald-400 shadow-md transition-transform z-50"
                >
                    {isSidebarOpen ? (
                        <ChevronLeft className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )}
                </button>

                <div className="overflow-hidden h-full flex flex-col">
                    {/* Platform Identity Branding */}
                    <div className="p-4 border-b border-slate-800/30 flex items-center gap-3 min-w-[240px]">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shrink-0">
                            <div className="h-full w-full rounded-[11px] bg-[#090d16] flex items-center justify-center">
                                <Shield className="h-4 w-4 text-emerald-400" />
                            </div>
                        </div>
                        <div
                            className={`transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0 lg:pointer-events-none"}`}
                        >
                            <div className="text-sm font-semibold tracking-wide text-slate-100">
                                LogiSec AI
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                                Security Intelligence
                            </div>
                        </div>
                    </div>

                    {/* Navigation Anchors Layout */}
                    <div className="p-3 space-y-6 flex-1 overflow-y-auto min-w-[240px]">
                        <div>
                            <span
                                className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2 transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0"}`}
                            >
                                Workspace
                            </span>
                            <div className="space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 transition-all">
                                    <Layers className="h-4 w-4 shrink-0" />
                                    <span
                                        className={`transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0"}`}
                                    >
                                        Analysis Console
                                    </span>
                                </button>
                                {isLoggedIn && (
                                    <Link
                                        to="/profile"
                                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all"
                                    >
                                        <History className="h-4 w-4 shrink-0" />
                                        <span
                                            className={`transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0"}`}
                                        >
                                            Audit Registry
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Network Monitoring Subsystems */}
                        <div
                            className={`transition-all duration-200 ${!isSidebarOpen && "lg:opacity-0 lg:pointer-events-none"}`}
                        >
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
                                Network Layer
                            </span>
                            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/30 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                        <Radio className="h-3.5 w-3.5 text-slate-500" />{" "}
                                        Pipeline:
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 font-medium ${socket ? "text-emerald-400" : "text-rose-400"}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${socket ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
                                        />
                                        {socket ? "Connected" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Status Workspace Block */}
                <div className="p-3 border-t border-slate-800/30 bg-slate-900/10 flex items-center justify-between min-w-[240px]">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                            <User className="h-3.5 w-3.5 text-slate-300" />
                        </div>
                        <div
                            className={`truncate transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0"}`}
                        >
                            <div className="text-xs font-medium text-slate-200 truncate">
                                {isLoggedIn
                                    ? "SecOps Analyst"
                                    : "Guest Operator"}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                                {isLoggedIn
                                    ? "Authorized Tier"
                                    : "Volatile Session"}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`transition-opacity duration-200 ${!isSidebarOpen && "lg:opacity-0 lg:pointer-events-none"}`}
                    >
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    localStorage.removeItem("logisec_token");
                                    navigate(0);
                                }}
                                className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-md hover:bg-slate-800/30"
                                title="Sign Out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="text-slate-400 hover:text-emerald-400 transition-colors p-1.5 rounded-md hover:bg-slate-800/30"
                                title="Authenticate Account"
                            >
                                <LogIn className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* 🖥️ MAIN ENGINE CHAT CONSOLE AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0c1220]/20 pt-14 lg:pt-0">
                {/* VIEWPORT STREAM INPUT LISTENING BLOCK */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-5xl mx-auto w-full">
                    {chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto pt-16 sm:pt-24 select-none px-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/40 flex items-center justify-center shadow-xl mb-4">
                                <Code className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h2 className="text-base sm:text-lg xl:text-xl font-semibold text-slate-100 tracking-wide">
                                Automated Threat Vulnerability Scanner
                            </h2>
                            <p className="text-xs sm:text-sm xl:text-base text-slate-400 mt-2 leading-relaxed max-w-sm">
                                Paste your configuration objects or application
                                code strings inside the input terminal engine
                                below to analyze runtime vulnerabilities.
                            </p>
                        </div>
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 sm:gap-5 max-w-4xl ${msg.sender === "user" ? "justify-end ml-auto" : "mr-auto w-full"}`}
                            >
                                {msg.sender === "agent" && (
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm mt-1">
                                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                                    </div>
                                )}
                                {/* Responsive content box width handles & 1440p text configurations */}
                                <div
                                    className={`p-4 sm:p-6 xl:p-8 rounded-2xl border text-sm xl:text-base leading-relaxed max-w-full xl:max-w-4xl shadow-md ${
                                        msg.sender === "user"
                                            ? "bg-slate-800/40 border-slate-700/40 text-slate-200 font-mono whitespace-pre-wrap ml-6 sm:ml-12 shadow-sm break-all"
                                            : "bg-[#0c1220]/90 border-slate-800/60 text-slate-200 w-full"
                                    }`}
                                >
                                    <div
                                        className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3 ${msg.sender === "user" ? "text-slate-500" : "text-emerald-400"}`}
                                    >
                                        {msg.sender === "user"
                                            ? "Inspected Source Node"
                                            : "Threat Intelligence Breakdown"}
                                    </div>

                                    {/* TEXT MARKDOWN PARSING STREAM */}
                                    <div className="leading-relaxed text-slate-200 space-y-3.5 overflow-hidden">
                                        {msg.sender === "agent" ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => (
                                                        <p className="mb-4 last:mb-0 text-slate-300 font-normal leading-relaxed text-sm xl:text-base">
                                                            {children}
                                                        </p>
                                                    ),
                                                    h3: ({ children }) => (
                                                        <h3 className="text-sm sm:text-base xl:text-lg font-bold text-slate-100 mt-8 mb-4 tracking-wide uppercase flex items-center gap-2 border-b border-slate-800/60 pb-2">
                                                            {children}
                                                        </h3>
                                                    ),
                                                    hr: () => (
                                                        <hr className="border-slate-800/60 my-6" />
                                                    ),
                                                    strong: ({ children }) => (
                                                        <strong className="text-emerald-400 font-semibold">
                                                            {children}
                                                        </strong>
                                                    ),
                                                    code: ({
                                                        children,
                                                        className,
                                                    }) => {
                                                        const inline =
                                                            !className;
                                                        return inline ? (
                                                            <code className="bg-slate-900/80 px-2 py-0.5 rounded font-mono text-emerald-400 border border-slate-800/50 text-xs xl:text-sm font-medium mx-0.5 break-all">
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <div className="my-5 border border-slate-800/80 rounded-xl bg-slate-950 overflow-hidden shadow-xl font-mono text-left w-full">
                                                                <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-[10px] sm:text-xs xl:text-sm text-slate-400 font-sans select-none">
                                                                    <span className="font-medium tracking-wide truncate pr-2">
                                                                        TERMINAL
                                                                        WORKSPACE
                                                                        SOURCE
                                                                    </span>
                                                                    <span className="text-emerald-400 font-semibold text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                                                                        Active
                                                                        Code
                                                                        Block
                                                                    </span>
                                                                </div>
                                                                <pre className="p-4 overflow-x-auto text-xs xl:text-sm text-slate-300 leading-relaxed font-medium">
                                                                    <code>
                                                                        {
                                                                            children
                                                                        }
                                                                    </code>
                                                                </pre>
                                                            </div>
                                                        );
                                                    },
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="whitespace-pre-wrap font-mono text-slate-200 text-xs xl:text-sm leading-relaxed">
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* SKELETON RESPONSIVE SHIMMER LOADER */}
                    {loading && (
                        <div className="flex gap-3 sm:gap-5 mr-auto w-full max-w-3xl animate-fade-in">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                <Shield className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                            </div>
                            <div className="p-4 sm:p-5 rounded-2xl border border-slate-800/60 bg-[#0c1220]/60 backdrop-blur-md shadow-lg w-full space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase select-none">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="animate-pulse">
                                        Analyzing payload structures...
                                    </span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="h-4 bg-gradient-to-r from-slate-800 via-slate-700/70 to-slate-800 bg-[length:200%_100%] animate-shimmer w-1/3 rounded-md" />
                                    <div className="h-3 bg-gradient-to-r from-slate-800 via-slate-700/50 to-slate-800 bg-[length:200%_100%] animate-shimmer w-3/4 rounded-md" />
                                    <div className="h-3 bg-gradient-to-r from-slate-800 via-slate-700/50 to-slate-800 bg-[length:200%_100%] animate-shimmer w-2/3 rounded-md" />
                                </div>
                                <div className="pt-2">
                                    <div className="h-20 bg-slate-900/80 border border-slate-800/50 rounded-xl p-3 space-y-2">
                                        <div className="h-2 bg-slate-800 w-1/4 rounded animate-pulse" />
                                        <div className="h-2 bg-slate-800 w-1/2 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT LAYOUT SUBMISSION FOOTER LAYER */}
                <footer className="p-4 sm:p-6 bg-gradient-to-t from-[#090d16] to-transparent">
                    <form
                        onSubmit={handleSendMessage}
                        className="max-w-4xl mx-auto relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur opacity-40 group-focus-within:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex flex-col bg-[#0c1220] border border-slate-800/80 rounded-2xl focus-within:border-emerald-500/50 transition-all shadow-xl">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Paste sensitive code sequences here to process vulnerability analytics..."
                                className="w-full bg-transparent max-h-48 min-h-[64px] rounded-t-2xl px-4 pt-4 pb-2 text-sm xl:text-base text-white caret-emerald-400 placeholder-slate-500 font-mono focus:outline-none resize-none leading-relaxed"
                                rows={2}
                            />
                            <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-slate-800/30 text-slate-500 text-[10px] sm:text-xs xl:text-sm">
                                <span className="hidden sm:flex items-center gap-1">
                                    <CornerDownLeft className="h-3 w-3" /> Press
                                    Enter to execute payload scan
                                </span>
                                <span className="sm:hidden text-slate-600">
                                    LogiSec Diagnostics Engine
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-[#090d16] font-semibold rounded-lg text-xs xl:text-sm transition-all tracking-wide disabled:opacity-30 ml-auto"
                                >
                                    Analyze <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </form>
                </footer>
            </main>
        </div>
    );
}
