import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import BuyMeCoffee from "./pages/BuyMeCoffee.tsx";
import Success from "./pages/Success.tsx";

function HomePage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to My Todo App
                </h1>
                <p className="text-gray-500 text-lg mb-6">
                    Stay organized. Get things done.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700">
                    Get Started
                </button>
            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/buy-me-a-coffee" element={<BuyMeCoffee />} />
                <Route path="/success" element={<Success/>} />
            </Route>

        </Routes>
    );
}

export default App;