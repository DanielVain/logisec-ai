import React from "react";

interface AuthSubmitButtonProps {
    loading: boolean;
    isSignUp: boolean;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
    loading,
    isSignUp,
}) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-40 cursor-pointer"
        >
            {loading
                ? "PROCESSING..."
                : isSignUp
                  ? "PROVISION CREDENTIALS"
                  : "AUTHORIZE ACCOUNT"}
        </button>
    );
};
