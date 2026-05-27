import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpdateResponse {
    name: string;
    email: string;
    token: string;
}

type ModalType = "name" | "email" | "password" | null;

// ─── Component ────────────────────────────────────────────────────────────────
function ProfilePage() {
    const navigate = useNavigate();

    // Read current values from localStorage (saved at login/register)
    const [displayName, setDisplayName]   = useState(localStorage.getItem("name")  ?? "");
    const [displayEmail, setDisplayEmail] = useState(localStorage.getItem("email") ?? "");

    // Profile picture — stored as a data-URL in localStorage, or null
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        localStorage.getItem("avatar") ?? null
    );

    // Which modal is open
    const [openModal, setOpenModal] = useState<ModalType>(null);

    // Shared loading / error state for whichever modal is open
    const [loading, setLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    // Input values inside modals
    const [inputValue, setInputValue]           = useState("");
    const [passwordValue, setPasswordValue]     = useState("");

    // ── Helpers ──────────────────────────────────────────────────────────────

    function openEdit(type: ModalType) {
        setModalError("");
        setInputValue(
            type === "name"  ? displayName  :
                type === "email" ? displayEmail : ""
        );
        setPasswordValue("");
        setOpenModal(type);
    }

    function closeModal() {
        setOpenModal(null);
        setModalError("");
    }

    function syncFromResponse(data: UpdateResponse) {
        setDisplayName(data.name);
        setDisplayEmail(data.email);
        localStorage.setItem("name",  data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("token", data.token);
    }

    // ── Profile picture ───────────────────────────────────────────────────────

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setAvatarUrl(dataUrl);
            localStorage.setItem("avatar", dataUrl);
        };
        reader.readAsDataURL(file);
    }

    // ── API calls ─────────────────────────────────────────────────────────────

    async function handleUpdateName() {
        if (!inputValue.trim()) return;
        setLoading(true);
        setModalError("");
        try {
            const res = await api.put<UpdateResponse>("/profile/updateName", {
                name: inputValue,
            });
            syncFromResponse(res.data);
            closeModal();
        } catch {
            setModalError("Failed to update name. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateEmail() {
        if (!inputValue.trim()) return;
        setLoading(true);
        setModalError("");
        try {
            const res = await api.put<UpdateResponse>("/profile/updateEmail", {
                email: inputValue,
            });
            syncFromResponse(res.data);
            closeModal();
        } catch {
            setModalError("Failed to update email. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdatePassword() {
        if (!passwordValue.trim()) return;
        setLoading(true);
        setModalError("");
        try {
            const res = await api.put<UpdateResponse>("/profile/updatePassword", {
                password: passwordValue,
            });
            syncFromResponse(res.data);
            closeModal();
        } catch {
            setModalError("Failed to update password. Try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleModalSubmit() {
        if (openModal === "name")     handleUpdateName();
        if (openModal === "email")    handleUpdateEmail();
        if (openModal === "password") handleUpdatePassword();
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // Added flex flex-col to root
        <div className="min-h-screen flex flex-col bg-gray-100">

            <Navbar name={displayName} />

            {/* Added flex-grow w-full pb-16 to push footer down */}
            <div className={`flex-grow w-full max-w-lg mx-auto mt-10 px-4 pb-16 space-y-6 transition-all duration-200 ${openModal ? "blur-sm pointer-events-none" : ""}`}>

                {/* ── Avatar section ──────────────────────────────────────── */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
                    <div className="relative w-20 h-20 shrink-0">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 select-none border border-gray-300">
                                {displayName.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-md"
                            title="Change photo"
                        >
                            ✏️
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-800">{displayName}</p>
                        <p className="text-sm text-gray-500">{displayEmail}</p>
                    </div>
                </div>

                {/* ── Name row ────────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Name</p>
                        <p className="text-gray-800 font-medium">{displayName}</p>
                    </div>
                    <button onClick={() => openEdit("name")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Edit
                    </button>
                </div>

                {/* ── Email row ───────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                        <p className="text-gray-800 font-medium">{displayEmail}</p>
                    </div>
                    <button onClick={() => openEdit("email")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Edit
                    </button>
                </div>

                {/* ── Password row ─────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Password</p>
                        <p className="text-gray-500 tracking-widest">••••••••</p>
                    </div>
                    <button onClick={() => openEdit("password")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Edit
                    </button>
                </div>

                {/* ── Logout ──────────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <button
                        onClick={handleLogout}
                        className="w-full text-red-500 py-2.5 rounded-xl border border-red-200 font-bold hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98]"
                    >
                        Logout
                    </button>
                </div>

            </div>

            {/* ── Modal overlay ────────────────────────────────────────────── */}
            {openModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-extrabold text-gray-800 mb-6">
                            {openModal === "name"     && "Update Name"}
                            {openModal === "email"    && "Update Email"}
                            {openModal === "password" && "Update Password"}
                        </h3>

                        {openModal === "password" ? (
                            <input
                                type="password"
                                value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                placeholder="New password (6–32 chars)"
                                autoFocus
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-4"
                            />
                        ) : (
                            <input
                                type={openModal === "email" ? "email" : "text"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={openModal === "email" ? "New email" : "New name"}
                                autoFocus
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-4"
                            />
                        )}

                        {modalError && (
                            <p className="text-red-500 text-sm mb-4 font-medium">{modalError}</p>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalSubmit}
                                disabled={loading || (openModal === "password" ? !passwordValue : !inputValue)}
                                className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Footer ──────────────────────────────────────────────── */}
            <Footer />
        </div>
    );
}

export default ProfilePage;