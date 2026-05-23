import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        title: "Capture Everything",
        desc: "Instantly jot down tasks before they slip your mind. Zero friction, pure focus.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Stay on Target",
        desc: "Prioritize ruthlessly, track progress, and always know what to tackle next.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Get Things Done",
        desc: "Nothing beats the satisfaction of checking off the last item on your list.",
    },
];

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-900 text-white relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
            <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Taskly</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 text-white/80 hover:text-white font-medium transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-5 py-2 bg-white text-indigo-900 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg shadow-white/10"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 max-w-4xl mx-auto text-center px-8 pt-20 pb-20">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/90">Simple. Focused. Productive.</span>
                </div>

                <h1 className="text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up animation-delay-200">
                    Your tasks,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300">
                        beautifully<br />organized
                    </span>
                </h1>

                <p className="text-xl text-white/65 mb-10 max-w-lg mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                    Stop juggling sticky notes. Taskly helps you capture, organize, and complete your work with total clarity.
                </p>

                <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in-up animation-delay-600">
                    <button
                        onClick={() => navigate("/register")}
                        className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all shadow-2xl shadow-white/20 hover:shadow-white/30 hover:-translate-y-0.5"
                    >
                        Start for free →
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all hover:-translate-y-0.5"
                    >
                        Sign in
                    </button>
                </div>
            </section>

            {/* Feature cards */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-5">
                {features.map((f, i) => (
                    <div
                        key={f.title}
                        className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all hover:-translate-y-1 animate-fade-in-up`}
                        style={{ animationDelay: `${0.6 + i * 0.15}s` }}
                    >
                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-violet-300">
                            {f.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                        <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* Footer */}
            <div className="relative z-10 text-center pb-8 text-white/30 text-sm">
                © {new Date().getFullYear()} Taskly — Built for doers.
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
            </Route>

        </Routes>
    );
}

export default App;