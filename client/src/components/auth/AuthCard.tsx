import React from "react";

interface AuthCardProps {
    children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-mono antialiased">
            <div className="w-full max-w-md rounded border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                {children}
            </div>
        </div>
    );
};
