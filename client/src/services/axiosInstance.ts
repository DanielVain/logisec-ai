import axios from "axios";
import toast from "react-hot-toast";

// 🚨 DYNAMIC SWITCH: Reads from Render's environment, falls back to local machine
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 10000,
});

// Request Interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("logisec_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.message === "Network Error" ||
            error.code === "ERR_NETWORK" ||
            !error.response
        ) {
            toast.error(
                "Security Gateway Unreachable. Check connection matrix.",
                {
                    id: "network-fatal",
                    icon: "🌐",
                },
            );
            return Promise.reject(error);
        }

        const { status, data } = error.response;
        const errorMessage =
            data?.error || "An internal subsystem exception occurred.";

        switch (status) {
            case 401:
                toast.error(
                    "Clearance signatures expired. Re-authenticating...",
                    { id: "auth-expired" },
                );
                localStorage.removeItem("logisec_token");
                break;
            case 403:
                toast.error(`Access Denied: ${errorMessage}`, { icon: "🚫" });
                break;
            case 500:
                toast.error(`Server Error [500]: ${errorMessage}`, {
                    id: "server-crash",
                });
                break;
            default:
                console.error(`Subsystem Exception [${status}]:`, errorMessage);
        }

        return Promise.reject(error);
    },
);

export default API;
