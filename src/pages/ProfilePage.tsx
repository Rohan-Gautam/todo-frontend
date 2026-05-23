import Navbar from "../components/Navbar.tsx";


function ProfilePage () {

    const name = localStorage.getItem("name") ?? "User";

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar name={name} />


        </div>
    )
}