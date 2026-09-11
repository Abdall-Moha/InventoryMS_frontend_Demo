import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

function EditExpense() {

    const navigate = useNavigate();
    const params = useParams();
    const expenseId = params.id;

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Rent");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/expenses/" + expenseId);

                setTitle(response.data.title);
                setAmount(response.data.amount);
                setCategory(response.data.category);
                setDescription(response.data.description || "");

            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to load expense.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [expenseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {

            await api.put("/expenses/" + expenseId, {
                title: title,
                amount: amount,
                category: category,
                description: description,
            });

            navigate("/expenses");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update expense.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Expense</h2>
                <p className="text-sm text-gray-500">Update expense information</p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Expense Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Rent">Rent</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Salaries">Salaries</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Supplies">Supplies</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Amount *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update Expense"}
                    </button>

                    <Link
                        to="/expenses"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default EditExpense;
