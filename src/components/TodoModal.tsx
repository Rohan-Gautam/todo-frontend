
type TodoModalProps = {
    title: string;
    todoTitle: string;
    todoDescription: string;
    todoPriority: string;
    loading: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onSubmit: () => void;
    onClose: () => void;
    submitLabel: string;
};

// Sketched Priority Buttons
const getPriorityColor = (priority: string, isSelected: boolean) => {
    if (!isSelected) return "bg-white border-slate-400 text-slate-500 hover:border-slate-800 hover:text-slate-800 border-4 border-dashed";

    switch (priority) {
        case "URGENT": return "bg-rose-300 border-slate-800 text-slate-900 border-4 shadow-[4px_4px_0_#1e293b] transform -rotate-2";
        case "HIGH": return "bg-amber-300 border-slate-800 text-slate-900 border-4 shadow-[4px_4px_0_#1e293b] transform rotate-2";
        case "MODERATE": return "bg-sky-300 border-slate-800 text-slate-900 border-4 shadow-[4px_4px_0_#1e293b] transform -rotate-1";
        case "LOW": return "bg-emerald-300 border-slate-800 text-slate-900 border-4 shadow-[4px_4px_0_#1e293b] transform rotate-1";
        default: return "bg-white border-slate-800 text-slate-900 border-4";
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
            {/* Sketched Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-50 rounded-lg w-full max-w-md z-50 overflow-hidden border-4 border-slate-800 shadow-[12px_12px_0_#1e293b] transform -rotate-1">

                {/* Header */}
                <div className="bg-amber-200 border-b-4 border-slate-800 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-wide">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-800 hover:bg-amber-300 border-4 border-transparent hover:border-slate-800 px-2 py-1 rounded-md transition-all font-bold text-xl"
                    >
                        ❌
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-2xl text-slate-800 font-bold mb-2">Note Title</label>
                        <input
                            type="text"
                            value={todoTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="What's the plan?"
                            className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-2xl text-slate-800 font-bold mb-2">Scribble Details...</label>
                        <textarea
                            value={todoDescription}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Add some messy details here..."
                            rows={4}
                            className="w-full border-4 border-slate-800 bg-white rounded-md px-4 py-3 text-xl text-slate-800 font-bold outline-none focus:bg-amber-100 transition-colors shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)] resize-none"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-2xl text-slate-800 font-bold mb-4">Color Label</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {priorities.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => onPriorityChange(p)}
                                    className={`py-2 px-1 rounded-md text-lg font-bold transition-all duration-200 ${getPriorityColor(p, todoPriority === p)}`}
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
                        className="w-full bg-blue-400 text-slate-900 border-4 border-slate-800 py-3 rounded-md text-3xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                    >
                        {loading ? "Drawing..." : submitLabel}
                    </button>
                </div>
            </div>
        </>
    );
}

export default TodoModal;