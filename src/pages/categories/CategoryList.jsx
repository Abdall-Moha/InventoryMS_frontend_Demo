import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";

function CategoryList() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchCategories = async (searchText) => {
        try {
            setLoading(true);
            setError("");

            let url = "/categories";
            if (searchText) {
                url = "/categories?search=" + searchText;
            }

            const response = await api.get(url);
            setCategories(response.data);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load categories.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories("");
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchCategories(value);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await api.delete("/categories/" + selectedCategory._id);

            setDeleteModalOpen(false);
            setSelectedCategory(null);
            fetchCategories(search);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete category.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                    <p className="text-sm text-gray-500">Manage product categories</p>
                </div>

                <Link
                    to="/categories/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add Category
                </Link>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name or description..."
                />
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <Loader />
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{category.name}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {category.description || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={"/categories/edit/" + category._id}
                                                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
                                                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDelete
                isOpen={deleteModalOpen}
                title="Delete Category"
                message={"Are you sure you want to delete \"" + (selectedCategory ? selectedCategory.name : "") + "\"?"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                loading={deleteLoading}
            />
        </div>
    );
}

export default CategoryList;
