import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-screen bg-slate-950 font-mono text-slate-200 p-8 antialiased">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-400 mb-6 transition-colors select-none"
                >
                    <ArrowLeft className="h-4 w-4" /> Return to Terminal Line
                </Link>
                {children}
            </div>
        </div>
    );
};
