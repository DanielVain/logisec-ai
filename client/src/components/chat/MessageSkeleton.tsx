import React from "react";

export const MessageSkeleton: React.FC = () => {
    return (
        <div className="flex gap-3 sm:gap-5 mr-auto w-full max-w-3xl animate-fade-in">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-800/60 bg-[#0c1220]/60 backdrop-blur-md shadow-lg w-full space-y-4">
                <div className="space-y-2.5">
                    <div className="h-4 bg-gradient-to-r from-slate-800 via-slate-700/70 to-slate-800 bg-[length:200%_100%] animate-shimmer w-1/3 rounded-md" />
                    <div className="h-3 bg-gradient-to-r from-slate-800 via-slate-700/50 to-slate-800 bg-[length:200%_100%] animate-shimmer w-3/4 rounded-md" />
                </div>
            </div>
        </div>
    );
};
