import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
    Terminal,
    ShieldAlert,
    Send,
    User,
    LogIn,
    LogOut,
    Code,
    Cpu,
    ShieldCheck,
    HelpCircle,
    Activity,
    ExternalLink,
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

    const handleLogout = () => {
        localStorage.removeItem("logisec_token");
        navigate(0); // Refresh the active state
    };

    return (
        <div className="flex h-screen w-screen bg-slate-950 font-mono text-slate-200 overflow-hidden">
            {/* LEFT SIDEBAR: SYSTEM CONTROLS & MONITOR */}
            <aside className="w-64 border-r border-slate-800/80 bg-slate-900/50 flex flex-col justify-between shrink-0 select-none">
                <div>
                    {/* Brand Panel */}
                    <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-emerald-950 border border-emerald-800/60">
                            <ShieldAlert className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-wider text-slate-100">
                                LOGISEC CORE
                            </div>
                            <div className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
                                SecOps Framework v2
                            </div>
                        </div>
                    </div>

                    {/* System Environment Metrics */}
                    <div className="p-4 space-y-4">
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Activity className="h-3 w-3" /> System
                                Diagnostics
                            </div>
                            <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded border border-slate-800/40">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">
                                        WS_CONN:
                                    </span>
                                    <span
                                        className={
                                            socket
                                                ? "text-emerald-400 font-semibold flex items-center gap-1"
                                                : "text-rose-400 font-semibold"
                                        }
                                    >
                                        {socket && (
                                            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
                                        )}
                                        {socket ? "ONLINE" : "OFFLINE"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">
                                        ENGINE:
                                    </span>
                                    <span className="text-slate-300">
                                        GEMINI_CORE
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Vectors */}
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                                Navigation Vectors
                            </div>
                            {isLoggedIn ? (
                                <Link
                                    to="/profile"
                                    className="flex items-center justify-between w-full px-3 py-2 text-xs rounded border border-slate-800/50 bg-slate-900/40 text-slate-300 hover:text-emerald-400 hover:border-emerald-900/50 hover:bg-emerald-950/10 transition-all group"
                                >
                                    <span className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5" /> Past
                                        Audit Logs
                                    </span>
                                    <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ) : (
                                <div className="p-3 rounded border border-amber-900/30 bg-amber-950/10 text-amber-500/90 text-[11px] leading-relaxed">
                                    🔒 Log in to activate automated persistent
                                    indexing to your cloud database matrix.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Identity Context Footer */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate mr-2">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${isLoggedIn ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
                        />
                        <span className="text-[11px] text-slate-400 font-mono truncate">
                            {isLoggedIn ? "Operator_Active" : "Guest_User"}
                        </span>
                    </div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Disconnect Session"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                            title="Authenticate Operator"
                        >
                            <LogIn className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </div>
            </aside>

            {/* RIGHT SIDE: WORKING WORKSPACE DIVIDED PANES */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOP STATUS BAR */}
                <header className="h-14 border-b border-slate-800/80 bg-slate-900/20 px-6 flex items-center justify-between shrink-0 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                        <span>SHELL_STATUS:</span>
                        <span className="text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/30 text-[10px]">
                            READY_TO_SCAN
                        </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold tracking-wider">
                        CONTEXT_BASED_THREAT_MODELING
                    </div>
                </header>

                {/* DUAL STREAM PANES BLOCK */}
                <div className="flex-1 flex overflow-hidden min-h-0">
                    {/* SOURCE EXTRACTION INJECTION BLOCK (LEFT PANE) */}
                    <div className="w-1/2 p-4 flex flex-col border-r border-slate-800/80 bg-slate-950/20">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                            <Code className="h-4 w-4 text-emerald-500" /> Source
                            Inspection Unit
                        </div>
                        <form
                            onSubmit={handleSendMessage}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="// Paste suspect target code sequences, configurations, or parameters here...&#10;// Example: const secure = req.body.token + input;"
                                className="flex-1 w-full bg-slate-950 text-slate-300 font-mono text-xs p-4 rounded border border-slate-800/80 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none resize-none leading-relaxed shadow-2xl shadow-black/50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="mt-3 h-11 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <Cpu className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                                        Executing Analytical Diagnostics...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        Initialize Threat Vector Scan
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* AI LIVE THREAT ANALYSIS REPORT MATRIX (RIGHT PANE) */}
                    <div className="w-1/2 p-4 flex flex-col bg-slate-950/40 min-h-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />{" "}
                            Real-time Incident Mitigation Matrix
                        </div>

                        <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-4 shadow-inner min-h-0">
                            {chatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-6 select-none">
                                    <HelpCircle className="h-8 w-8 mb-2 text-slate-700 stroke-[1.5]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Engine Awaiting Input
                                    </p>
                                    <p className="text-[11px] lowercase mt-1 max-w-xs text-slate-500 leading-normal">
                                        Submit code vectors via the inspection
                                        panel to generate secure architectural
                                        alternatives and trace logic paths.
                                    </p>
                                </div>
                            ) : (
                                chatHistory.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded border transition-all ${
                                            msg.sender === "user"
                                                ? "bg-slate-900/30 border-slate-800/80 text-slate-400"
                                                : "bg-emerald-950/10 border-emerald-900/20 text-slate-200 shadow-sm"
                                        }`}
                                    >
                                        <div
                                            className={`text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                                                msg.sender === "user"
                                                    ? "text-slate-500"
                                                    : "text-emerald-400"
                                            }`}
                                        >
                                            {msg.sender === "user"
                                                ? "// EVALUATED_TARGET_LOG"
                                                : "🛡️ MITIGATION_REMEDIATION_REPORT"}
                                        </div>
                                        {/* Preserve standard pre-wrap spacing while rendering data outputs clearly */}
                                        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed selection:bg-emerald-800/30 text-slate-300">
                                            {msg.content}
                                        </pre>
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="p-4 rounded border border-dashed border-emerald-900/40 bg-emerald-950/5 text-emerald-400/80 text-xs flex items-center gap-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="tracking-wide animate-pulse uppercase text-[11px]">
                                        Tracing zero-day markers & signature
                                        anomalies...
                                    </span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
