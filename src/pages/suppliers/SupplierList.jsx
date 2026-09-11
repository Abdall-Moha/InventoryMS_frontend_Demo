import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ConfirmDelete from "../../components/ConfirmDelete.jsx";

function SupplierList() {

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchSuppliers = async (searchText) => {
        try {
            setLoading(true);
            setError("");

            let url = "/suppliers";
            if (searchText) {
                url = "/suppliers?search=" + searchText;
            }

            const response = await api.get(url);
            setSuppliers(response.data);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load suppliers.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers("");
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchSuppliers(value);
    };

    const openDeleteModal = (supplier) => {
        setSelectedSupplier(supplier);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await api.delete("/suppliers/" + selectedSupplier._id);

            setDeleteModalOpen(false);
            setSelectedSupplier(null);
            fetchSuppliers(search);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete supplier.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
                    <p className="text-sm text-gray-500">Manage product suppliers</p>
                </div>

                <Link
                    to="/suppliers/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add Supplier
                </Link>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, phone, or contact..."
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
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Contact Person</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Address</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No suppliers found.
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{supplier.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{supplier.contactPerson || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{supplier.email || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{supplier.phone || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{supplier.address || "-"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={"/suppliers/edit/" + supplier._id}
                                                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteModal(supplier)}
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
                title="Delete Supplier"
                message={"Are you sure you want to delete \"" + (selectedSupplier ? selectedSupplier.name : "") + "\"?"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                loading={deleteLoading}
            />
        </div>
    );
}

export default SupplierList;
