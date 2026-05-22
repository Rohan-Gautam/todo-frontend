type TodoModalProps = {
    title: string;
    todoTitle: string;
    todoDescription: string;
    loading: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => void;
    onClose: () => void;
    submitLabel: string;
};

function TodoModal({
                       title,
                       todoTitle,
                       todoDescription,
                       loading,
                       onTitleChange,
                       onDescriptionChange,
                       onSubmit,
                       onClose,
                       submitLabel,
                   }: TodoModalProps) {
    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={todoTitle}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        value={todoDescription}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder="Add some details..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </>
    );
}

export default TodoModal;