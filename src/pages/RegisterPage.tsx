import { useState } from "react";
import { useNavigate} from "react-router-dom";
import api from "../api/axios";

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
        }
        catch (error) {
            setError(error + "An error occured. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome here.</h1>
                <p className="text-gray-500 mb-8">Register yourself a new account</p>

                {error && (
                    <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 font-medium cursor-pointer"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default RegisterPage;