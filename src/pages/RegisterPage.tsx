import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer"; // <-- Imported the Footer

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/api/auth/register", {
                name: name,
                email: email,
                password: password,
            });

            const token = response.data.token;

            localStorage.setItem("token", token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);

            navigate("/dashboard");
        } catch (err: any) {
            // Safely extract the message from your Spring Boot DTO validation
            const backendMessage = err.response?.data?.message || err.response?.data;
            setError(typeof backendMessage === 'string' ? backendMessage : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        // Changed to flex-col so we can stack the card and the footer
        <div className="min-h-screen flex flex-col font-['Kalam',_cursive] text-slate-800 bg-[#fcfbf9] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]">

            {/* Wrapper to center the register card in the available space */}
            <div className="flex-grow flex items-center justify-center p-4">

                {/* The Sketched "Card" */}
                <div className="relative bg-amber-50 p-10 rounded-xl border-4 border-slate-800 shadow-[12px_12px_0_#1e293b] w-full max-w-md transform rotate-1">

                    {/* Masking Tape */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 bg-white/40 border border-slate-800/20 backdrop-blur-sm transform -rotate-3 shadow-sm z-10"></div>

                    <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-wide underline decoration-wavy decoration-blue-400 decoration-2 underline-offset-4">
                        Join the Club! 🎨
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 font-bold">
                        Scribble your details to get started.
                    </p>

                    {error && (
                        <div className="mb-6 transform -rotate-1">
                            <p className="text-rose-600 font-bold text-lg bg-rose-100 border-2 border-slate-800 inline-block px-4 py-2 shadow-[4px_4px_0_#1e293b]">
                                ⚠️ {error}
                            </p>
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-2xl text-slate-800 font-bold mb-2">Name Tag</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What should we call you?"
                            className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-2xl text-slate-800 font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-2xl text-slate-800 font-bold mb-2">Secret Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6 to 32 characters..."
                            className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]"
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={loading || !name || !email || !password}
                        className="w-full bg-blue-400 text-slate-900 border-4 border-slate-800 py-3 rounded-md text-2xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                    >
                        {loading ? "Scribbling..." : "Sign Me Up! 🚀"}
                    </button>

                    <div className="text-center mt-8 text-xl font-bold text-slate-600">
                        Already have a page here?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:text-blue-700 underline decoration-wavy decoration-2 underline-offset-4 transition-colors"
                        >
                            Log in
                        </button>
                    </div>

                </div>
            </div>

            {/* Footer with white background to end the grid nicely */}
            <div className="flex flex-col justify-start w-full bg-white border-t-4 border-slate-800">
                <Footer />
            </div>

        </div>
    );
}

export default RegisterPage;