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
        // Math Notebook Grid Background + Kalam Font
        <div className="min-h-screen flex flex-col font-['Kalam',_cursive] text-slate-800 bg-[#fcfbf9] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]">

            <Navbar name={displayName} />

            <div className={`flex-grow w-full max-w-lg mx-auto mt-10 px-4 pb-16 space-y-6 transition-all duration-300 ${openModal ? "blur-sm pointer-events-none" : ""}`}>

                {/* ── Avatar Profile Card (Sketched) ──────────────────────── */}
                <div className="relative bg-amber-100 p-6 rounded-lg border-4 border-slate-800 shadow-[8px_8px_0_#1e293b] flex items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                    {/* Tape holding the profile card */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 border border-slate-800/20 backdrop-blur-sm transform rotate-3 shadow-sm z-10"></div>

                    <div className="relative w-24 h-24 shrink-0">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-[4px_4px_0_#1e293b]"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl text-slate-800 font-bold select-none border-4 border-slate-800 shadow-[4px_4px_0_#1e293b]">
                                {displayName.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-blue-300 text-slate-800 border-2 border-slate-800 text-lg rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-400 shadow-[2px_2px_0_#1e293b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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
                        <p className="text-3xl font-bold text-slate-900 tracking-wide">{displayName}</p>
                        <p className="text-lg text-slate-600 font-bold mt-1 bg-white inline-block px-2 border-2 border-slate-800 shadow-[2px_2px_0_#1e293b] rounded-sm transform rotate-1">{displayEmail}</p>
                    </div>
                </div>

                {/* ── Name row ────────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-lg border-4 border-slate-800 shadow-[6px_6px_0_#1e293b] flex items-center justify-between transform rotate-1">
                    <div>
                        <p className="text-lg text-slate-500 font-bold mb-0.5">Name Tag</p>
                        <p className="text-2xl text-slate-900 font-bold">{displayName}</p>
                    </div>
                    <button onClick={() => openEdit("name")} className="px-3 py-1.5 bg-amber-200 border-2 border-slate-800 rounded-md font-bold text-lg shadow-[2px_2px_0_#1e293b] hover:bg-amber-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        Edit ✏️
                    </button>
                </div>

                {/* ── Email row ───────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-lg border-4 border-slate-800 shadow-[6px_6px_0_#1e293b] flex items-center justify-between transform -rotate-1 mt-6">
                    <div>
                        <p className="text-lg text-slate-500 font-bold mb-0.5">Mailbox</p>
                        <p className="text-2xl text-slate-900 font-bold">{displayEmail}</p>
                    </div>
                    <button onClick={() => openEdit("email")} className="px-3 py-1.5 bg-amber-200 border-2 border-slate-800 rounded-md font-bold text-lg shadow-[2px_2px_0_#1e293b] hover:bg-amber-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        Edit ✏️
                    </button>
                </div>

                {/* ── Password row ─────────────────────────────────────────── */}
                <div className="bg-white p-5 rounded-lg border-4 border-slate-800 shadow-[6px_6px_0_#1e293b] flex items-center justify-between transform rotate-1 mt-6">
                    <div>
                        <p className="text-lg text-slate-500 font-bold mb-0.5">Secret Key</p>
                        <p className="text-3xl text-slate-900 tracking-widest mt-1">••••••••</p>
                    </div>
                    <button onClick={() => openEdit("password")} className="px-3 py-1.5 bg-amber-200 border-2 border-slate-800 rounded-md font-bold text-lg shadow-[2px_2px_0_#1e293b] hover:bg-amber-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        Edit ✏️
                    </button>
                </div>

                {/* ── Logout ──────────────────────────────────────────────── */}
                <div className="mt-10">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-rose-400 text-slate-900 border-4 border-slate-800 py-3 rounded-md text-2xl font-bold hover:bg-rose-500 transition-all shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                    >
                        Sign Out 🚪
                    </button>
                </div>

            </div>

            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-6 z-30">
                <div className="relative flex items-center group">
                    <span className="absolute right-full mr-4 bg-white border-2 border-slate-800 text-slate-800 text-lg font-bold px-4 py-2 rounded-md shadow-[4px_4px_0_#1e293b] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -rotate-2">
                        Fuel the dev ☕
                    </span>
                    <button
                        onClick={() => navigate("/buy-me-a-coffee")}
                        className="bg-amber-300 text-slate-800 w-16 h-16 rounded-full border-4 border-slate-800 shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all flex items-center justify-center text-2xl"
                    >
                        ☕
                    </button>
                </div>
            </div>

            {/* ── Sketched Modal Overlay ────────────────────────────────────────────── */}
            {openModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={closeModal}
                >
                    <div
                        className="bg-amber-50 rounded-lg w-full max-w-sm mx-4 overflow-hidden border-4 border-slate-800 shadow-[12px_12px_0_#1e293b] transform -rotate-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-amber-200 border-b-4 border-slate-800 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-slate-800 tracking-wide">
                                {openModal === "name"     && "Change Name Tag"}
                                {openModal === "email"    && "Change Mailbox"}
                                {openModal === "password" && "New Secret Key"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-slate-800 hover:bg-amber-300 border-4 border-transparent hover:border-slate-800 px-2 py-1 rounded-md transition-all font-bold text-xl"
                            >
                                ❌
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {openModal === "password" ? (
                                <input
                                    type="password"
                                    value={passwordValue}
                                    onChange={(e) => setPasswordValue(e.target.value)}
                                    placeholder="New password (6–32 chars)"
                                    autoFocus
                                    className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)] mb-4"
                                />
                            ) : (
                                <input
                                    type={openModal === "email" ? "email" : "text"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={openModal === "email" ? "New email" : "New name"}
                                    autoFocus
                                    className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)] mb-4"
                                />
                            )}

                            {modalError && (
                                <p className="text-rose-600 font-bold text-lg mb-4 bg-rose-100 border-2 border-slate-800 inline-block px-3 py-1 shadow-[2px_2px_0_#1e293b]">{modalError}</p>
                            )}

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-white border-4 border-slate-800 rounded-md font-bold text-xl shadow-[4px_4px_0_#1e293b] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all hover:bg-slate-100"
                                >
                                    Nvm
                                </button>
                                <button
                                    onClick={handleModalSubmit}
                                    disabled={loading || (openModal === "password" ? !passwordValue : !inputValue)}
                                    className="flex-1 py-3 bg-blue-400 text-slate-900 border-4 border-slate-800 rounded-md font-bold text-xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[4px_4px_0_#1e293b] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                                >
                                    {loading ? "Saving..." : "Save It"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer with white background to end the grid nicely */}
            <div className="flex flex-col justify-start w-full bg-white border-t-4 border-slate-800">
                <Footer />
            </div>
        </div>
    );
}

export default ProfilePage;