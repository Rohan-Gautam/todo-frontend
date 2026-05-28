import { useNavigate, useLocation } from "react-router-dom";

type NavbarProps = {
    name: string;
};

function Navbar({ name }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        // Added bg-white/70 and backdrop-blur-md for the frosted glass effect
        <nav className="bg-white/10 backdrop-blur-md border-b-4 border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
            {/* Left Side */}
            <div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`px-5 py-2 border-4 border-slate-800 rounded-md font-bold text-xl transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${
                        location.pathname === "/dashboard"
                            ? "bg-amber-200 shadow-[4px_4px_0_#1e293b]"
                            : "bg-white shadow-[4px_4px_0_#1e293b] hover:bg-slate-100"
                    }`}
                >
                    My Notes 📝
                </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 sm:gap-6">
                <span className="text-2xl font-bold text-slate-800 hidden sm:block">
                    Yo, {name}! ✌️
                </span>

                <button
                    onClick={() => navigate("/profile")}
                    className={`px-5 py-2 border-4 border-slate-800 rounded-md font-bold text-xl transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${
                        location.pathname === "/profile"
                            ? "bg-sky-300 shadow-[4px_4px_0_#1e293b] transform rotate-1"
                            : "bg-white shadow-[4px_4px_0_#1e293b] hover:bg-slate-100 transform -rotate-1"
                    }`}
                >
                    Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-rose-400 border-4 border-slate-800 rounded-md font-bold text-xl shadow-[4px_4px_0_#1e293b] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all hover:bg-rose-500 transform rotate-1"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;