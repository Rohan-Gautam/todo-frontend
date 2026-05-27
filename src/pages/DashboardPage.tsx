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

    // --- Pagination & Sync State ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- Filter & Search States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompleted, setFilterCompleted] = useState("all");
    const [filterPriority, setFilterPriority] = useState("ALL");

    // --- Modal States for New Task ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState("MODERATE");
    const [creating, setCreating] = useState(false);

    // --- Modal States for Editing Task ---
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("MODERATE");
    const [editing, setEditing] = useState(false);

    // --- Fetch Data ---
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

    // --- Actions ---
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
        // Root container is now white so any extra monitor space blends with the footer
        <div className="min-h-screen flex flex-col bg-white">

            {/* The grey content area hugging the tasks tightly */}
            <div className="bg-gray-100">
                <Navbar name={name} />

                {/* Removed flex-grow and reduced bottom padding to bring footer up */}
                <div className={`max-w-3xl mx-auto w-full mt-10 px-4 pb-12 transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>

                    {/* ── Search & Filter Bar ───────────────────────────── */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                        <div className="flex gap-4">
                            <select
                                value={filterCompleted}
                                onChange={(e) => {
                                    setFilterCompleted(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="false">Pending</option>
                                <option value="true">Completed</option>
                            </select>

                            <select
                                value={filterPriority}
                                onChange={(e) => {
                                    setFilterPriority(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="ALL">All Priorities</option>
                                <option value="URGENT">Urgent</option>
                                <option value="HIGH">High</option>
                                <option value="MODERATE">Moderate</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Soft Loading Container ───────────────────────────── */}
                    {/* Reduced min-h so it doesn't create artificial gaps on short lists */}
                    <div className="relative min-h-[150px]">
                        {error && <p className="text-center text-red-500 pb-4">{error}</p>}

                        {loading && todos.length === 0 && !error && (
                            <div className="absolute inset-0 flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        <div className={`transition-opacity duration-300 ${loading && todos.length > 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                            {!loading && todos.length === 0 && !error && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <p className="text-gray-400 font-medium mb-2">No tasks found in this view.</p>
                                    <p className="text-gray-400 text-sm">Adjust your filters or click the '+' button to add one.</p>
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

                    {/* ── Pagination UI ───────────────────────────── */}
                    {!loading && (
                        <div className="flex justify-center items-center gap-6 mt-8">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className={`px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold transition-all shadow-sm ${
                                    currentPage === 0
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                }`}
                            >
                                &larr; Prev
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-lg shadow-sm">
                                    Page <span className="text-blue-600">{currentPage + 1}</span> of {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className={`px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold transition-all shadow-sm ${
                                    currentPage >= totalPages - 1
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95"
                                }`}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* The white footer area flex-grows to consume any remaining monitor space */}
            <div className="flex-grow flex flex-col justify-start bg-white">
                <Footer />
            </div>

            {/* ── Fixed bottom-right buttons ───────────────────────────── */}
            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-30">
                <div className="relative flex items-center group">
                    <span className="absolute right-full mr-4 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300">
                        Buy me a coffee ☕
                    </span>
                    <button
                        onClick={() => navigate("/buy-me-a-coffee")}
                        className="bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-amber-500/30 hover:scale-105 flex items-center justify-center transition-all duration-300 active:scale-95"
                        aria-label="Buy me a coffee"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 8h1a4 4 0 110 8h-1" />
                            <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4Z" />
                            <line x1="6" y1="2" x2="6" y2="4" />
                            <line x1="10" y1="2" x2="10" y2="4" />
                            <line x1="14" y1="2" x2="14" y2="4" />
                        </svg>
                    </button>
                </div>

                <div className="relative flex items-center group">
                    <span className="absolute right-full mr-4 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300">
                        Create a Task 📝
                    </span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-br from-blue-500 to-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 flex items-center justify-center text-2xl transition-all duration-300 active:scale-95"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Modals ── */}
            {isModalOpen && (
                <TodoModal
                    title="New Task"
                    todoTitle={newTitle}
                    todoDescription={newDescription}
                    todoPriority={newPriority}
                    loading={creating}
                    onTitleChange={setNewTitle}
                    onDescriptionChange={setNewDescription}
                    onPriorityChange={setNewPriority}
                    onSubmit={handleCreate}
                    onClose={() => setIsModalOpen(false)}
                    submitLabel="Create Todo"
                />
            )}

            {editingTodo && (
                <TodoModal
                    title="Edit Task"
                    todoTitle={editTitle}
                    todoDescription={editDescription}
                    todoPriority={editPriority}
                    loading={editing}
                    onTitleChange={setEditTitle}
                    onDescriptionChange={setEditDescription}
                    onPriorityChange={setEditPriority}
                    onSubmit={handleEditSave}
                    onClose={() => setEditingTodo(null)}
                    submitLabel="Save Changes"
                />
            )}
        </div>
    );
}

export default DashboardPage;