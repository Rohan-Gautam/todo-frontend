import { useNavigate } from "react-router-dom";

type NavbarProps = {
    name: string;
}

function Navbar({ name }: NavbarProps) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        // sticky + top-0 + z-50 keeps it pinned at the top while scrolling
        <div className="sticky top-0 z-50 bg-white shadow-sm px-8 py-4 flex justify-between items-center">
            <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 text-sm">My Tasks</button>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">Hello, {name} 👋</span>

                {/* Profile button — navigates to /profile */}
                <button
                    onClick={() => navigate("/profile")}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 text-sm"
                >
                    Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 text-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;