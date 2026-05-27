import React from "react";

interface AuthInputGroupProps {
    label: string;
    type: "email" | "password";
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

export const AuthInputGroup: React.FC<AuthInputGroupProps> = ({
    label,
    type,
    value,
    placeholder,
    onChange,
}) => {
    return (
        <div>
            <label className="block text-[10px] uppercase text-slate-400 mb-1">
                {label}
            </label>
            <input
                type={type}
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder={placeholder}
            />
        </div>
    );
};
