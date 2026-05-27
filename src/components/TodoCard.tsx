import { useState } from "react";
import type { Todo } from "../types/todo";

type TodoCardProps = {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
};

// Helper function to get priority styling
const getPriorityStyling = (priority: string) => {
    switch (priority) {
        case "URGENT":
            return {
                borderAccent: "border-l-red-500",
                badge: "bg-red-50 text-red-700 border-red-200",
                dot: "bg-red-500",
                label: "Urgent",
            };
        case "HIGH":
            return {
                borderAccent: "border-l-orange-500",
                badge: "bg-orange-50 text-orange-700 border-orange-200",
                dot: "bg-orange-500",
                label: "High",
            };
        case "MODERATE":
            return {
                borderAccent: "border-l-blue-500",
                badge: "bg-blue-50 text-blue-700 border-blue-200",
                dot: "bg-blue-500",
                label: "Moderate",
            };
        case "LOW":
            return {
                borderAccent: "border-l-slate-400",
                badge: "bg-slate-50 text-slate-600 border-slate-200",
                dot: "bg-slate-400",
                label: "Low",
            };
        default:
            return {
                borderAccent: "border-l-gray-300",
                badge: "bg-gray-50 text-gray-600 border-gray-200",
                dot: "bg-gray-400",
                label: priority || "None",
            };
    }
};

function TodoCard({ todo, onToggleComplete, onDelete, onEdit }: TodoCardProps) {
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Safely fallback if priority is missing
    const priorityStyle = getPriorityStyling(todo.priority || "MODERATE");

    return (
        <>
            {/* ── Main Card ──────────────────────────────────────────────────────── */}
            <div
                onClick={() => setIsViewOpen(true)}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${priorityStyle.borderAccent} p-5 mb-4 flex flex-col sm:flex-row justify-between items-start gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
                {/* Left Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityStyle.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}></span>
                            {priorityStyle.label}
                        </span>

                        {/* Status Badge */}
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${todo.completed ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                            {todo.completed ? "Completed" : "In Progress"}
                        </span>
                    </div>

                    <h2 className={`text-lg font-bold truncate ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {todo.title}
                    </h2>
                    <p className={`text-sm mt-1 line-clamp-2 ${todo.completed ? "text-gray-400" : "text-gray-500"}`}>
                        {todo.description || <span className="italic text-gray-300">No description provided</span>}
                    </p>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 sm:mt-0 mt-2">
                    {/* Toggle Complete Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleComplete(todo); }}
                        className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                            todo.completed
                                ? "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:text-green-700"
                        }`}
                        title={todo.completed ? "Mark as pending" : "Mark as complete"}
                    >
                        {todo.completed ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(todo); }}
                        className="p-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center"
                        title="Edit Todo"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                        className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center"
                        title="Delete Todo"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── View Modal ──────────────────────────────────────────────────────── */}
            {isViewOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsViewOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-extrabold text-gray-800">Task Details</h2>
                                <button
                                    onClick={() => setIsViewOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Badges Row */}
                                <div className="flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${priorityStyle.badge}`}>
                                        <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`}></span>
                                        Priority: {priorityStyle.label}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${todo.completed ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                                        Status: {todo.completed ? "Completed" : "In Progress"}
                                    </span>
                                </div>

                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                        {todo.title}
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm">
                                            {todo.description || "No description was provided for this task."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-xs text-gray-400 font-medium">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Created on {new Date(todo.createdAt).toLocaleString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
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