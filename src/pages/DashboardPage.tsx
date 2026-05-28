import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";
import type { Todo } from "../types/todo";
import Footer from "../components/Footer";

function DashboardPage() {
    const name = localStorage.getItem("name") ?? "User";
    const navigate = useNavigate();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompleted, setFilterCompleted] = useState("all");
    const [filterPriority, setFilterPriority] = useState("ALL");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState("MODERATE");
    const [creating, setCreating] = useState(false);

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("MODERATE");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    size: "10",
                });

                if (searchTerm.trim()) params.append("search", searchTerm);
                if (filterCompleted !== "all") params.append("completed", filterCompleted);
                if (filterPriority !== "ALL") params.append("priority", filterPriority);

                const response = await api.get(`/api/todos?${params.toString()}`);

                setTodos(response.data.content);
                setTotalPages(Math.max(1, response.data.page ? response.data.page.totalPages : response.data.totalPages));
            } catch {
                setError("Failed to load todos.");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchTodos().catch(console.error);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filterCompleted, filterPriority, currentPage, refreshTrigger]);

    async function handleCreate() {
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            await api.post("/api/todos", {
                title: newTitle,
                description: newDescription,
                priority: newPriority,
            });

            setNewTitle("");
            setNewDescription("");
            setNewPriority("MODERATE");
            setIsModalOpen(false);

            if (currentPage === 0) {
                setRefreshTrigger((prev) => prev + 1);
            } else {
                setCurrentPage(0);
            }
        } catch {
            alert("Failed to create todo.");
        } finally {
            setCreating(false);
        }
    }

    function handleEditClick(todo: Todo) {
        setEditingTodo(todo);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
        setEditPriority(todo.priority || "MODERATE");
    }

    async function handleEditSave() {
        if (!editingTodo || !editTitle.trim()) return;
        setEditing(true);
        try {
            await api.put(`/api/todos/${editingTodo.id}`, {
                title: editTitle,
                description: editDescription,
                completed: editingTodo.completed,
                priority: editPriority,
            });

            setEditingTodo(null);
            setRefreshTrigger((prev) => prev + 1);
        } catch {
            alert("Failed to update todo.");
        } finally {
            setEditing(false);
        }
    }

    async function handleDelete(id: number) {
        try {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            await api.delete(`/api/todos/${id}`);

            if (todos.length === 1 && currentPage > 0) {
                setCurrentPage((prev) => prev - 1);
            } else {
                setRefreshTrigger((prev) => prev + 1);
            }
        } catch {
            alert("Failed to delete todo.");
            setRefreshTrigger((prev) => prev + 1);
        }
    }

    async function handleToggleComplete(todo: Todo) {
        try {
            await api.put(`/api/todos/${todo.id}`, {
                title: todo.title,
                description: todo.description,
                completed: !todo.completed,
                priority: todo.priority,
            });

            setRefreshTrigger((prev) => prev + 1);
        } catch {
            alert("Failed to update todo.");
        }
    }

    const isAnyModalOpen = isModalOpen || !!editingTodo;

    return (
        // Math Notebook Grid Background + Kalam Font globally applied!
        <div className="min-h-screen flex flex-col font-['Kalam',_cursive] text-slate-800 bg-[#fcfbf9] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]">

            <div className="flex-grow">
                <Navbar name={name} />

                <div className={`max-w-3xl mx-auto w-full mt-10 px-4 pb-12 transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>

                    {/* ── Sketched Search Bar ───────────────────────────── */}
                    <div className="bg-white p-4 rounded-lg shadow-[6px_6px_0_#1e293b] mb-10 flex flex-col md:flex-row gap-4 border-4 border-slate-800">
                        <input
                            type="text"
                            placeholder="Find a note..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="flex-1 px-4 py-2 bg-amber-50 border-2 border-slate-800 rounded-md focus:outline-none focus:bg-white text-xl placeholder:text-slate-400 font-bold"
                        />
                        <div className="flex gap-4">
                            <select
                                value={filterCompleted}
                                onChange={(e) => {
                                    setFilterCompleted(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="px-4 py-2 bg-amber-50 border-2 border-slate-800 rounded-md focus:outline-none cursor-pointer font-bold text-lg"
                            >
                                <option value="all">All Notes</option>
                                <option value="false">Working On</option>
                                <option value="true">Finished</option>
                            </select>

                            <select
                                value={filterPriority}
                                onChange={(e) => {
                                    setFilterPriority(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="px-4 py-2 bg-amber-50 border-2 border-slate-800 rounded-md focus:outline-none cursor-pointer font-bold text-lg"
                            >
                                <option value="ALL">All Levels</option>
                                <option value="URGENT">Urgent</option>
                                <option value="HIGH">High</option>
                                <option value="MODERATE">Moderate</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Sticky Notes Container ───────────────────────────── */}
                    <div className="relative min-h-[150px]">
                        {error && <p className="text-center text-red-600 font-bold text-2xl pb-4 bg-red-100 border-2 border-slate-800 inline-block px-4 py-2 rotate-2 shadow-[4px_4px_0_#1e293b]">{error}</p>}

                        {loading && todos.length === 0 && !error && (
                            <div className="absolute inset-0 flex justify-center py-10">
                                <span className="text-3xl font-bold animate-pulse">Drawing notes... ✍️</span>
                            </div>
                        )}

                        <div className={`transition-opacity duration-300 ${loading && todos.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                            {!loading && todos.length === 0 && !error && (
                                <div className="text-center py-16 bg-white border-4 border-slate-800 border-dashed rounded-lg shadow-[8px_8px_0_#1e293b] transform rotate-1">
                                    <p className="text-slate-800 font-bold text-3xl mb-2">Blank Page! 📄</p>
                                    <p className="text-slate-600 text-xl font-medium">Scribble a new note to get started.</p>
                                </div>
                            )}

                            {todos.map((todo) => (
                                <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onToggleComplete={handleToggleComplete}
                                    onDelete={handleDelete}
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Sketched Pagination ───────────────────────────── */}
                    {!loading && totalPages > 0 && (
                        <div className="flex justify-center items-center gap-6 mt-12">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className={`px-6 py-2 bg-white border-4 border-slate-800 rounded-md font-bold text-xl shadow-[4px_4px_0_#1e293b] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all ${
                                    currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-100"
                                }`}
                            >
                                &larr; Back
                            </button>

                            <div className="flex items-center">
                                <span className="text-xl font-bold text-slate-800 bg-white border-4 border-slate-800 px-5 py-2 rounded-md shadow-[4px_4px_0_#1e293b] transform -rotate-1">
                                    Pg <span className="text-blue-600 underline decoration-wavy decoration-2 underline-offset-4">{currentPage + 1}</span> of {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className={`px-6 py-2 bg-white border-4 border-slate-800 rounded-md font-bold text-xl shadow-[4px_4px_0_#1e293b] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all ${
                                    currentPage >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-100"
                                }`}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer with white background to end the grid nicely */}
            <div className="flex flex-col justify-start w-full bg-white border-t-4 border-slate-800">
                <Footer />
            </div>

            {/* ── Floating Sketched Buttons ───────────────────────────── */}
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

                <div className="relative flex items-center group">
                    <span className="absolute right-full mr-4 bg-white border-2 border-slate-800 text-slate-800 text-lg font-bold px-4 py-2 rounded-md shadow-[4px_4px_0_#1e293b] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all rotate-2">
                        Draw Note 📝
                    </span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-400 text-slate-800 w-16 h-16 rounded-full border-4 border-slate-800 shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all flex items-center justify-center text-3xl font-bold"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* ── Modals ── */}
            {isModalOpen && (
                <TodoModal
                    title="New Note"
                    todoTitle={newTitle}
                    todoDescription={newDescription}
                    todoPriority={newPriority}
                    loading={creating}
                    onTitleChange={setNewTitle}
                    onDescriptionChange={setNewDescription}
                    onPriorityChange={setNewPriority}
                    onSubmit={handleCreate}
                    onClose={() => setIsModalOpen(false)}
                    submitLabel="Pin it!"
                />
            )}

            {editingTodo && (
                <TodoModal
                    title="Edit Sketch"
                    todoTitle={editTitle}
                    todoDescription={editDescription}
                    todoPriority={editPriority}
                    loading={editing}
                    onTitleChange={setEditTitle}
                    onDescriptionChange={setEditDescription}
                    onPriorityChange={setEditPriority}
                    onSubmit={handleEditSave}
                    onClose={() => setEditingTodo(null)}
                    submitLabel="Save Edit"
                />
            )}
        </div>
    );
}

export default DashboardPage;