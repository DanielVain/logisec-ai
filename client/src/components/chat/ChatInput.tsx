import React from "react";
import { CornerDownLeft, ArrowRight } from "lucide-react";

interface ChatInputProps {
    message: string;
    setMessage: (msg: string) => void;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    message,
    setMessage,
    loading,
    onSubmit,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <footer className="p-4 sm:p-6 bg-gradient-to-t from-[#090d16] to-transparent">
            <form
                onSubmit={onSubmit}
                className="max-w-4xl mx-auto relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur opacity-40 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col bg-[#0c1220] border border-slate-800/80 rounded-2xl focus-within:border-emerald-500/50 transition-all shadow-xl">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste sensitive code sequences here to process vulnerability analytics..."
                        className="w-full bg-transparent max-h-48 min-h-[64px] rounded-t-2xl px-4 pt-4 pb-2 text-sm xl:text-base text-white caret-emerald-400 placeholder-slate-500 font-mono focus:outline-none resize-none leading-relaxed"
                        rows={2}
                    />
                    <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-slate-800/30 text-slate-500 text-[10px] sm:text-xs xl:text-sm">
                        <span className="hidden sm:flex items-center gap-1">
                            <CornerDownLeft className="h-3 w-3" /> Press Enter
                            to execute payload scan
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
    );
};
