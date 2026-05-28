import { useState } from "react";
import type { Todo } from "../types/todo";

type TodoCardProps = {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
};

// --- Sticky Note Colors ---
const getStickyStyling = (priority: string) => {
    switch (priority) {
        case "URGENT":
            return "bg-rose-200 border-rose-800"; // Pink sticky
        case "HIGH":
            return "bg-amber-200 border-amber-800"; // Yellow sticky
        case "MODERATE":
            return "bg-sky-200 border-sky-800"; // Blue sticky
        case "LOW":
            return "bg-emerald-200 border-emerald-800"; // Green sticky
        default:
            return "bg-purple-200 border-purple-800";
    }
};

function TodoCard({ todo, onToggleComplete, onDelete, onEdit }: TodoCardProps) {
    const [isViewOpen, setIsViewOpen] = useState(false);
    const stickyColor = getStickyStyling(todo.priority || "MODERATE");

    return (
        <>
            {/* ── Sticky Note Card ──────────────────────────────────────────────────────── */}
            <div
                onClick={() => setIsViewOpen(true)}
                // Hard marker border, solid drop shadow, slight rotation
                className={`group relative ${stickyColor} border-2 rounded-lg p-5 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4 cursor-pointer transform -rotate-1 hover:rotate-0 transition-transform duration-300 shadow-[4px_4px_0_#1e293b] hover:shadow-[6px_6px_0_#1e293b]`}
            >
                {/* ── The Masking Tape ── */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 border border-slate-800/20 backdrop-blur-sm transform rotate-3 shadow-sm"></div>

                {/* Left Content Area */}
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Priority "Sticker" */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-bold border-2 border-slate-800 bg-white text-slate-800 shadow-[2px_2px_0_#1e293b]`}>
                            {todo.priority || "Moderate"}
                        </span>

                        {/* Status Stamp */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-bold border-2 border-slate-800 shadow-[2px_2px_0_#1e293b] ${todo.completed ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}>
                            {todo.completed ? "Done ✅" : "Working ⏳"}
                        </span>
                    </div>

                    <h2 className={`text-2xl font-bold truncate tracking-wide mt-2 ${todo.completed ? "line-through text-slate-500 opacity-70" : "text-slate-900"}`}>
                        {todo.title}
                    </h2>
                    <p className={`text-lg mt-1 line-clamp-2 leading-relaxed ${todo.completed ? "text-slate-500 opacity-70" : "text-slate-800"}`}>
                        {todo.description || <span className="italic opacity-60">No description...</span>}
                    </p>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 sm:mt-0 mt-3 pt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleComplete(todo); }}
                        className={`p-2 rounded-md border-2 border-slate-800 transition-all flex items-center justify-center shadow-[2px_2px_0_#1e293b] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                            todo.completed ? "bg-slate-300 hover:bg-slate-400" : "bg-green-300 hover:bg-green-400"
                        }`}
                        title={todo.completed ? "Undo" : "Complete"}
                    >
                        {todo.completed ? "↩️" : "✔️"}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(todo); }}
                        className="p-2 bg-blue-300 border-2 border-slate-800 rounded-md hover:bg-blue-400 transition-all shadow-[2px_2px_0_#1e293b] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                        className="p-2 bg-red-300 border-2 border-slate-800 rounded-md hover:bg-red-400 transition-all shadow-[2px_2px_0_#1e293b] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* ── Sketched View Modal ──────────────────────────────────────────────────────── */}
            {isViewOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        onClick={() => setIsViewOpen(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4">
                        <div className="bg-amber-50 border-4 border-slate-800 rounded-xl shadow-[8px_8px_0_#1e293b] overflow-hidden">

                            <div className="bg-amber-200 border-b-4 border-slate-800 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-800">Note Details</h2>
                                <button
                                    onClick={() => setIsViewOpen(false)}
                                    className="text-slate-800 hover:bg-amber-300 border-2 border-transparent hover:border-slate-800 p-1 rounded-md transition-all font-bold text-xl"
                                >
                                    ❌
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className={`text-3xl font-bold mb-2 ${todo.completed ? "line-through opacity-70" : "text-slate-900"}`}>
                                        {todo.title}
                                    </h3>
                                    <div className="bg-white border-2 border-slate-800 rounded-md p-4 shadow-inner">
                                        <p className="text-xl text-slate-800 whitespace-pre-wrap leading-relaxed">
                                            {todo.description || "No description..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-500 font-bold text-lg">
                                    Drawn on: {new Date(todo.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default TodoCard;