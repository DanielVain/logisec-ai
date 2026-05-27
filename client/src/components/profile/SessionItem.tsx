import React from "react";
import ReactMarkdown from "react-markdown";
import { Code, ChevronDown, Shield, User } from "lucide-react";

interface Message {
    sender: "user" | "agent";
    content: string;
}

interface Session {
    _id: string;
    title: string;
    createdAt: string;
    messages?: Message[];
}

interface SessionItemProps {
    session: Session;
    isExpanded: boolean;
    onToggle: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
    session,
    isExpanded,
    onToggle,
}) => {
    return (
        <div className="border border-slate-800 bg-slate-900/10 rounded overflow-hidden transition-all duration-200">
            {/* HEADER COMPONENT LINE: Toggle controller line */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 text-left transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-3 truncate pr-2">
                    <Code
                        className={`h-4 w-4 shrink-0 transition-colors ${isExpanded ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400"}`}
                    />
                    <span
                        className={`text-xs font-semibold tracking-wide truncate ${isExpanded ? "text-slate-100" : "text-slate-300"}`}
                    >
                        {session.title}
                    </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 select-none">
                    <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                        {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-180 text-emerald-400" : ""}`}
                    />
                </div>
            </button>

            {/* EXPANDED ARCHIVE CONVERSATION TRAIL VIEW */}
            {isExpanded && (
                <div className="border-t border-slate-800/60 bg-slate-950/40 px-4 py-5 space-y-6 font-sans">
                    {!session.messages || session.messages.length === 0 ? (
                        <div className="text-[11px] text-slate-500 font-mono text-center py-2">
                            Syncing audit transcript nodes...
                        </div>
                    ) : (
                        session.messages.map((msg, idx) => {
                            const isAgent = msg.sender === "agent";
                            return (
                                <div key={idx} className="space-y-2 max-w-full">
                                    {/* Identity Anchor Label */}
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider select-none">
                                        {isAgent ? (
                                            <>
                                                <Shield className="h-3 w-3 text-emerald-400" />
                                                <span className="text-emerald-400 font-bold">
                                                    Threat Intelligence Output
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <User className="h-3 w-3 text-slate-500" />
                                                <span className="text-slate-400 font-semibold">
                                                    Operator Source Entry
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Text Parser Layer Block */}
                                    <div
                                        className={`p-4 rounded-lg border text-sm leading-relaxed ${
                                            !isAgent
                                                ? "bg-slate-900/30 border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap break-all"
                                                : "bg-slate-900/10 border-slate-800/30 text-slate-300"
                                        }`}
                                    >
                                        {isAgent ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => (
                                                        <p className="mb-3 last:mb-0 text-slate-300 text-xs leading-relaxed">
                                                            {children}
                                                        </p>
                                                    ),
                                                    h3: ({ children }) => (
                                                        <h3 className="text-xs font-bold text-slate-200 mt-5 mb-2 uppercase tracking-wide border-b border-slate-800/60 pb-1">
                                                            {children}
                                                        </h3>
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
                                                            <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-emerald-400 text-[11px] border border-slate-800/40">
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <pre className="my-3 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-400 overflow-x-auto leading-normal">
                                                                <code>
                                                                    {children}
                                                                </code>
                                                            </pre>
                                                        );
                                                    },
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
