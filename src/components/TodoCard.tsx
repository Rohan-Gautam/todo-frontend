import { useState } from "react";
import type { Todo } from "../types/todo";

type TodoCardProps = {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
};

function TodoCard({ todo, onToggleComplete, onDelete, onEdit }: TodoCardProps) {
    const [isViewOpen, setIsViewOpen] = useState(false);

    return (
        <>
            {/* Card */}
            <div
                onClick={() => setIsViewOpen(true)}
                className="bg-white rounded-2xl shadow-sm p-6 mb-4 flex justify-between items-start cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
                <div>
                    <h2 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {todo.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{todo.description}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${todo.completed ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                        {todo.completed ? "Done" : "Pending"}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleComplete(todo); }}
                        className={`px-3 py-1 rounded-xl text-sm ${todo.completed ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}
                    >
                        {todo.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(todo); }}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-xl text-sm hover:bg-blue-200"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-xl text-sm hover:bg-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* View Modal */}
            {isViewOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
                        onClick={() => setIsViewOpen(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-20">

                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Todo Details</h2>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${todo.completed ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                                {todo.completed ? "Done" : "Pending"}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Title</p>
                            <p className="text-gray-800 text-lg font-medium">{todo.title}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Description</p>
                            <p className="text-gray-600">{todo.description || "No description added."}</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Created At</p>
                            <p className="text-gray-600">{new Date(todo.createdAt).toLocaleString()}</p>
                        </div>

                        <button
                            onClick={() => setIsViewOpen(false)}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-lg font-semibold hover:bg-gray-200"
                        >
                            Close
                        </button>

                    </div>
                </>
            )}
        </>
    );
}

export default TodoCard;