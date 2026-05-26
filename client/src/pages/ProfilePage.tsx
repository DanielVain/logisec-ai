import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/axiosInstance";
import { ArrowLeft, Database, Code } from "lucide-react";

interface Session {
    _id: string;
    title: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        API.get("/ai/sessions")
            .then((res) => {
                if (res.data.success) setSessions(res.data.sessions);
            })
            .catch((err) =>
                console.error(
                    "Failed to query repository index timeline.",
                    err,
                ),
            );
    }, []);

    return (
        <div className="min-h-screen w-screen bg-slate-950 font-mono text-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Return to Terminal Line
                </Link>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                    <Database className="h-6 w-6 text-emerald-400" />
                    <div>
                        <h1 className="text-lg font-bold tracking-wider">
                            SEC_REGISTRY // ARCHIVE_INDEX
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                            Persistent Historic Audit Trail Ledger
                        </p>
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <div className="border border-dashed border-slate-800 p-8 text-center rounded text-slate-600 text-xs">
                        No secure repository indexing blocks logged for this
                        operator signature.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((s) => (
                            <div
                                key={s._id}
                                className="flex items-center justify-between border border-slate-800 bg-slate-900/30 p-3 rounded hover:border-emerald-800/60 transition-all"
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <Code className="h-4 w-4 text-slate-600 shrink-0" />
                                    <span className="text-xs font-semibold tracking-wide text-slate-300 truncate">
                                        {s.title}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-4">
                                    {new Date(s.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
