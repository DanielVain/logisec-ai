import React from "react";

interface AuthMessageBannerProps {
    error: string;
}

export const AuthMessageBanner: React.FC<AuthMessageBannerProps> = ({
    error,
}) => {
    if (!error) return null;

    return (
        <div className="mt-4 border border-rose-800 bg-rose-950/50 p-2 text-xs text-rose-400">
            {error}
        </div>
    );
};
