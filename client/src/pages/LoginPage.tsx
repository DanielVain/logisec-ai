import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axiosInstance";

// Complete Atomic Component Registry
import { AuthCard } from "../components/auth/AuthCard";
import { AuthHeader } from "../components/auth/AuthHeader";
import { AuthMessageBanner } from "../components/auth/AuthMessageBanner";
import { AuthForm } from "../components/auth/AuthForm";
import { AuthInputGroup } from "../components/auth/AuthInputGroup";
import { AuthSubmitButton } from "../components/auth/AuthSumbitButton";
import { AuthToggleLink } from "../components/auth/AuthToggleLink";

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

    const toggleAuthMode = () => {
        setIsSignUp(!isSignUp);
        setError(""); // Clear error state instantly when switching layouts
    };

    return (
        <AuthCard>
            <AuthHeader />

            <AuthMessageBanner error={error} />

            <AuthForm onSubmit={handleSubmit}>
                <AuthInputGroup
                    label="System Mail String"
                    type="email"
                    value={email}
                    placeholder="analyst@logisec.io"
                    onChange={setEmail}
                />

                <AuthInputGroup
                    label="Access Key Crypt"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={setPassword}
                />

                <AuthSubmitButton loading={loading} isSignUp={isSignUp} />
            </AuthForm>

            <AuthToggleLink isSignUp={isSignUp} onClick={toggleAuthMode} />
        </AuthCard>
    );
}
