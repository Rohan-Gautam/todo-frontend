import { useNavigate} from "react-router-dom";

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
        <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">My Todos</h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-600">Hello, {name} 👋</span>
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