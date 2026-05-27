import React from "react";
import { Link } from "react-router-dom";
import {
    Shield,
    Layers,
    History,
    Radio,
    User,
    LogOut,
    LogIn,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    isMobileMenuOpen: boolean;
    isLoggedIn: boolean;
    isSocketConnected: boolean;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileMenuOpen,
    isLoggedIn,
    isSocketConnected,
    onLogout,
}) => {
    return (
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
                                    className={`inline-flex items-center gap-1 font-medium ${isSocketConnected ? "text-emerald-400" : "text-rose-400"}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${isSocketConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
                                    />
                                    {isSocketConnected
                                        ? "Connected"
                                        : "Offline"}
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
                            {isLoggedIn ? "SecOps Analyst" : "Guest Operator"}
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
                            onClick={onLogout}
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
    );
};
