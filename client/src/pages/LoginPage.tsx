import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axiosInstance";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
            const res = await API.post(endpoint, { email, password });
            if (res.data.success) {
                localStorage.setItem("logisec_token", res.data.token);
                navigate("/");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.error ||
                    "Authentication operational failure.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-mono">
            <div className="w-full max-w-md rounded border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                <h2 className="text-center text-xl font-bold tracking-widest text-emerald-400">
                    LOGISEC // ACCESS
                </h2>
                {error && (
                    <div className="mt-4 border border-rose-800 bg-rose-950/50 p-2 text-xs text-rose-400">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase text-slate-400 mb-1">
                            System Mail String
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                            placeholder="analyst@logisec.io"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-slate-400 mb-1">
                            Access Key Crypt
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-40"
                    >
                        {loading
                            ? "PROCESSING..."
                            : isSignUp
                              ? "PROVISION CREDENTIALS"
                              : "AUTHORIZE ACCOUNT"}
                    </button>
                </form>
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="mt-4 w-full text-center text-xs text-slate-500 hover:text-emerald-400 underline"
                >
                    {isSignUp
                        ? "Already cleared? Authorize System"
                        : "Request dynamic access clearance"}
                </button>
            </div>
        </div>
    );
}
