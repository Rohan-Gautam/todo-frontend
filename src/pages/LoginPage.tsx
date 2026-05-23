import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/api/auth/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);
            navigate("/dashboard");
        } catch {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") handleLogin();
    }

    return (
        <div className="min-h-screen flex">

            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-900 relative overflow-hidden flex-col justify-between p-12">
                {/* Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-purple-500/25 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-400/25 rounded-full blur-3xl animate-blob animation-delay-4000" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">Taskly</span>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-white mb-4 leading-snug">
                        Welcome back.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">
                            Pick up where you left off.
                        </span>
                    </h2>
                    <p className="text-white/60 text-lg mb-10">
                        Your tasks are waiting. Sign in and get things done.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "All your tasks in one place",
                            "Manage and prioritize with ease",
                            "Stay productive every day",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-white/75">
                                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 text-white/30 text-sm">
                    © {new Date().getFullYear()} Taskly
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-gray-900 font-bold text-xl">Taskly</span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Sign in</h1>
                    <p className="text-gray-500 mb-8">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            Create one
                        </button>
                    </p>

                    {error && (
                        <div className="flex items-start gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-5" onKeyDown={handleKeyDown}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="mt-7 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in…
                            </span>
                        ) : "Sign in"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;
