import React from "react";
import ReactMarkdown from "react-markdown";
import { Shield } from "lucide-react";

interface Message {
    sender: "user" | "agent";
    content: string;
}

interface MessageItemProps {
    msg: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ msg }) => {
    const isAgent = msg.sender === "agent";

    return (
        <div
            className={`flex gap-3 sm:gap-5 max-w-4xl ${!isAgent ? "justify-end ml-auto" : "mr-auto w-full"}`}
        >
            {isAgent && (
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                </div>
            )}

            <div
                className={`p-4 sm:p-6 xl:p-8 rounded-2xl border text-sm xl:text-base leading-relaxed max-w-full xl:max-w-4xl shadow-md ${
                    !isAgent
                        ? "bg-slate-800/40 border-slate-700/40 text-slate-200 font-mono whitespace-pre-wrap ml-6 sm:ml-12 shadow-sm break-all"
                        : "bg-[#0c1220]/90 border-slate-800/60 text-slate-200 w-full"
                }`}
            >
                <div
                    className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3 ${!isAgent ? "text-slate-500" : "text-emerald-400"}`}
                >
                    {!isAgent
                        ? "Inspected Source Node"
                        : "Threat Intelligence Breakdown"}
                </div>

                <div className="leading-relaxed text-slate-200 space-y-3.5 overflow-hidden">
                    {isAgent ? (
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
                                code: ({ children, className }) => {
                                    const inline = !className;
                                    return inline ? (
                                        <code className="bg-slate-900/80 px-2 py-0.5 rounded font-mono text-emerald-400 border border-slate-800/50 text-xs xl:text-sm font-medium mx-0.5 break-all">
                                            {children}
                                        </code>
                                    ) : (
                                        <div className="my-5 border border-slate-800/80 rounded-xl bg-slate-950 overflow-hidden shadow-xl font-mono text-left w-full">
                                            <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-[10px] sm:text-xs xl:text-sm text-slate-400 font-sans select-none">
                                                <span className="font-medium tracking-wide truncate pr-2">
                                                    TERMINAL WORKSPACE SOURCE
                                                </span>
                                                <span className="text-emerald-400 font-semibold text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                                                    Active Code Block
                                                </span>
                                            </div>
                                            <pre className="p-4 overflow-x-auto text-xs xl:text-sm text-slate-300 leading-relaxed font-medium">
                                                <code>{children}</code>
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
    );
};
