import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";
import type { Todo } from "../types/todo";

function DashboardPage() {
    const name = localStorage.getItem("name") ?? "User";

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [creating, setCreating] = useState(false);

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const response = await api.get("/api/todos");
                setTodos(response.data);
            } catch {
                setError("Failed to load todos.");
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, []);

    async function handleCreate() {
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            const response = await api.post("/api/todos", {
                title: newTitle,
                description: newDescription,
            });
            setTodos([response.data, ...todos]);
            setNewTitle("");
            setNewDescription("");
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
    }

    async function handleEditSave() {
        if (!editingTodo || !editTitle.trim()) return;
        setEditing(true);
        try {
            const response = await api.put(`/api/todos/${editingTodo.id}`, {
                title: editTitle,
                description: editDescription,
                completed: editingTodo.completed,
            });
            setTodos(todos.map((t) => (t.id === editingTodo.id ? response.data : t)));
            setEditingTodo(null);
        } catch {
            alert("Failed to update todo.");
        } finally {
            setEditing(false);
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/api/todos/${id}`);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch {
            alert("Failed to delete todo.");
        }
    }

    async function handleToggleComplete(todo: Todo) {
        try {
            const response = await api.put(`/api/todos/${todo.id}`, {
                title: todo.title,
                description: todo.description,
                completed: !todo.completed,
            });
            setTodos(todos.map((t) => (t.id === todo.id ? response.data : t)));
        } catch {
            alert("Failed to update todo.");
        }
    }

    const isAnyModalOpen = isModalOpen || !!editingTodo;

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar name={name} />

            <div className={`max-w-2xl mx-auto mt-10 px-4 transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>
                {loading && <p className="text-center text-gray-500">Loading todos...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && todos.length === 0 && (
                    <p className="text-center text-gray-400">No todos yet. Click + to create one!</p>
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

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
            >
                ✏️
            </button>

            {isModalOpen && (
                <TodoModal
                    title="New Todo"
                    todoTitle={newTitle}
                    todoDescription={newDescription}
                    loading={creating}
                    onTitleChange={setNewTitle}
                    onDescriptionChange={setNewDescription}
                    onSubmit={handleCreate}
                    onClose={() => setIsModalOpen(false)}
                    submitLabel="Create Todo"
                />
            )}

            {editingTodo && (
                <TodoModal
                    title="Edit Todo"
                    todoTitle={editTitle}
                    todoDescription={editDescription}
                    loading={editing}
                    onTitleChange={setEditTitle}
                    onDescriptionChange={setEditDescription}
                    onSubmit={handleEditSave}
                    onClose={() => setEditingTodo(null)}
                    submitLabel="Save Changes"
                />
            )}

        </div>
    );
}

export default DashboardPage;