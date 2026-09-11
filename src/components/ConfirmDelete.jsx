function ConfirmDelete({ isOpen, title, message, onConfirm, onCancel, loading }) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDelete;
