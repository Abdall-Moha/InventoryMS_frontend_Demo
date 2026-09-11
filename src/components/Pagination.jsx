function Pagination({ currentPage, totalPages, onPageChange }) {

    if (totalPages <= 1) {
        return null;
    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="mt-4 flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
                Prev
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                        currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
