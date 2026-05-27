import React from "react";
import { Shield, Menu, X } from "lucide-react";

interface MobileHeaderProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
}) => {
    return (
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
    );
};
