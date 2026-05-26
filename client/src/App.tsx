import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

// Simple guard to protect historical data screens
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("logisec_token");
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Guest-accessible live chat interface */}
                <Route path="/" element={<ChatPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Secured dashboard analysis history */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
