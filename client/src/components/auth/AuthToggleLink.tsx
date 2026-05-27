import React from "react";

interface AuthToggleLinkProps {
    isSignUp: boolean;
    onClick: () => void;
}

export const AuthToggleLink: React.FC<AuthToggleLinkProps> = ({
    isSignUp,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="mt-4 w-full text-center text-xs text-slate-500 hover:text-emerald-400 underline transition-colors cursor-pointer"
        >
            {isSignUp
                ? "Already cleared? Authorize System"
                : "Request dynamic access clearance"}
        </button>
    );
};
