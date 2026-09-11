import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import ConfirmDelete from "../../components/ConfirmDelete.jsx";

function ExpenseList() {

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [limit, setLimit] = useState(10);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchExpenses = async (page) => {
        try {
            setLoading(true);
            setError("");

            if (dateTo && !dateFrom) {
                setError("Please select a start date first.");
                setLoading(false);
                return;
            }

            let url = "/expenses?page=" + page + "&limit=10";

            if (dateFrom) url = url + "&dateFrom=" + dateFrom;
            if (dateTo) url = url + "&dateTo=" + dateTo;

            const response = await api.get(url);
            setExpenses(response.data.expenses);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalExpenses(response.data.totalExpenses);
            setLimit(response.data.limit);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(1);
    }, [dateFrom, dateTo]);

    const openDeleteModal = (expense) => {
        setSelectedExpense(expense);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await api.delete("/expenses/" + selectedExpense._id);
            setDeleteModalOpen(false);
            setSelectedExpense(null);
            fetchExpenses(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete expense.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        if (category === "Rent") return "bg-purple-100 text-purple-700";
        if (category === "Utilities") return "bg-blue-100 text-blue-700";
        if (category === "Salaries") return "bg-green-100 text-green-700";
        if (category === "Maintenance") return "bg-yellow-100 text-yellow-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold text-gray-800">Expenses</h2><p className="text-sm text-gray-500">Track supermarket running costs</p></div><Link to="/expenses/add" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">+ Add Expense</Link></div>

            <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium text-gray-700">Date From</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Date To</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div></div>

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            {loading ? <Loader /> : <><div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-gray-200 bg-gray-50"><tr><th className="px-4 py-3 font-semibold text-gray-700">Date</th><th className="px-4 py-3 font-semibold text-gray-700">Title</th><th className="px-4 py-3 font-semibold text-gray-700">Category</th><th className="px-4 py-3 font-semibold text-gray-700">Amount</th><th className="px-4 py-3 font-semibold text-gray-700">Description</th><th className="px-4 py-3 font-semibold text-gray-700">Recorded By</th><th className="px-4 py-3 font-semibold text-gray-700">Actions</th></tr></thead><tbody>{expenses.length === 0 ? <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No expenses found.</td></tr> : expenses.map((expense) => <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-gray-600">{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : "-"}</td><td className="px-4 py-3 font-medium text-gray-800">{expense.title}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryColor(expense.category)}`}>{expense.category}</span></td><td className="px-4 py-3 font-medium text-red-600">${Number(expense.amount || 0).toFixed(2)}</td><td className="px-4 py-3 text-gray-600">{expense.description || "-"}</td><td className="px-4 py-3 text-gray-600">{expense.createdBy ? expense.createdBy.name : "-"}</td><td className="px-4 py-3"><div className="flex gap-2"><Link to={"/expenses/edit/" + expense._id} className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100">Edit</Link><button onClick={() => openDeleteModal(expense)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button></div></td></tr>)}</tbody></table></div></div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-gray-500">Showing {totalExpenses === 0 ? 0 : ((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalExpenses)} of {totalExpenses} expenses</p><div className="flex items-center gap-2"><button onClick={() => fetchExpenses(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} onClick={() => fetchExpenses(page)} className={currentPage === page ? "rounded-lg bg-blue-600 px-3 py-2 text-sm text-white" : "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"}>{page}</button>)}<button onClick={() => fetchExpenses(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button></div></div></>}

            <ConfirmDelete isOpen={deleteModalOpen} title="Delete Expense" message={"Are you sure you want to delete \"" + (selectedExpense ? selectedExpense.title : "") + "\"?"} onConfirm={handleDelete} onCancel={() => setDeleteModalOpen(false)} loading={deleteLoading} />
        </div>
    );
}

export default ExpenseList;
