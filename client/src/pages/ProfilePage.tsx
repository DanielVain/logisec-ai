import { useState, useEffect } from "react";
import API from "../services/axiosInstance";

// Divided Atomic Components
import { ProfileLayout } from "../components/profile/ProfileLayout";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { SessionItem } from "../components/profile/SessionItem";

interface Message {
    sender: "user" | "agent";
    content: string;
    _id?: string;
}

interface Session {
    _id: string;
    title: string;
    createdAt: string;
    messages?: Message[]; // Optional field populated on drill-down
}

export default function ProfilePage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
        null,
    );

    // Initial Fetch: Query repository index catalog logs
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

    // Interactive Trigger: Fetch complete conversation payload if missing, then toggle fold
    const handleToggleSession = async (sessionId: string) => {
        if (expandedSessionId === sessionId) {
            setExpandedSessionId(null);
            return;
        }

        const targetSession = sessions.find((s) => s._id === sessionId);

        // Optimization: Avoid hitting network stack if conversation structures already exist in memory
        if (targetSession && targetSession.messages) {
            setExpandedSessionId(sessionId);
            return;
        }

        try {
            const res = await API.get(`/ai/sessions/${sessionId}`);
            if (res.data.success) {
                // Defensive Fallback: Extract message matrix dynamically whether nested or unnested
                const incomingMessages =
                    res.data.session?.messages || res.data.messages || [];

                setSessions((prev) =>
                    prev.map((s) =>
                        s._id === sessionId
                            ? { ...s, messages: incomingMessages }
                            : s,
                    ),
                );
                setExpandedSessionId(sessionId);
            }
        } catch (err) {
            console.error(
                "Failed to recover detailed transcript sequence.",
                err,
            );
        }
    };

    return (
        <ProfileLayout>
            <ProfileHeader />

            {sessions.length === 0 ? (
                <div className="border border-dashed border-slate-800 p-8 text-center rounded text-slate-600 text-xs select-none">
                    No secure repository indexing blocks logged for this
                    operator signature.
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <SessionItem
                            key={session._id}
                            session={session}
                            isExpanded={expandedSessionId === session._id}
                            onToggle={() => handleToggleSession(session._id)}
                        />
                    ))}
                </div>
            )}
        </ProfileLayout>
    );
}
