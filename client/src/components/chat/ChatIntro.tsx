import React from "react";
import { Code } from "lucide-react";

export const ChatIntro: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto pt-16 sm:pt-24 select-none px-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/40 flex items-center justify-center shadow-xl mb-4">
                <Code className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-base sm:text-lg xl:text-xl font-semibold text-slate-100 tracking-wide">
                Automated Threat Vulnerability Scanner
            </h2>
            <p className="text-xs sm:text-sm xl:text-base text-slate-400 mt-2 leading-relaxed max-w-sm">
                Paste your configuration objects or application code strings
                inside the input terminal engine below to analyze runtime
                vulnerabilities.
            </p>
        </div>
    );
};
