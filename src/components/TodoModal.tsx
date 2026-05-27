
type TodoModalProps = {
    title: string;
    todoTitle: string;
    todoDescription: string;
    todoPriority: string; // <-- NEW
    loading: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPriorityChange: (value: string) => void; // <-- NEW
    onSubmit: () => void;
    onClose: () => void;
    submitLabel: string;
};

// Helper to get the specific color classes for the selected priority
const getPriorityColor = (priority: string, isSelected: boolean) => {
    if (!isSelected) return "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300";

    switch (priority) {
        case "URGENT": return "bg-red-50 border-red-500 text-red-700 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
        case "HIGH": return "bg-orange-50 border-orange-500 text-orange-700 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
        case "MODERATE": return "bg-blue-50 border-blue-500 text-blue-700 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
        case "LOW": return "bg-slate-50 border-slate-500 text-slate-700 shadow-[0_0_10px_rgba(100,116,139,0.2)]";
        default: return "bg-gray-50 border-gray-500 text-gray-700";
    }
};

function TodoModal({
                       title,
                       todoTitle,
                       todoDescription,
                       todoPriority,
                       loading,
                       onTitleChange,
                       onDescriptionChange,
                       onPriorityChange,
                       onSubmit,
                       onClose,
                       submitLabel,
                   }: TodoModalProps) {

    const priorities = ["URGENT", "HIGH", "MODERATE", "LOW"];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl w-full max-w-md z-50 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-8 py-5 flex justify-between items-center">
                    <h2 className="text-xl font-extrabold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="mb-5">
                        <label className="block text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Title</label>
                        <input
                            type="text"
                            value={todoTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            value={todoDescription}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Add some details..."
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50 hover:bg-white focus:bg-white"
                        />
                    </div>

                    {/* NEW: Priority Selector */}
                    <div className="mb-8">
                        <label className="block text-sm text-gray-500 font-bold uppercase tracking-wider mb-3">Priority Level</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {priorities.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => onPriorityChange(p)}
                                    className={`py-2 px-1 border-2 rounded-xl text-xs font-bold transition-all duration-200 ${getPriorityColor(p, todoPriority === p)}`}
                                >
                                    {p.charAt(0) + p.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onSubmit}
                        disabled={loading || !todoTitle.trim()}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            submitLabel
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

export default TodoModal;