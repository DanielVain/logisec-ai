import React from "react";

interface AuthFormProps {
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, children }) => {
    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {children}
        </form>
    );
};
