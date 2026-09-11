import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";

function CustomerList() {

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const isEmployee = user && user.role === "Employee";

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchCustomers = async (searchText) => {
        try {
            setLoading(true);
            setError("");

            let url = "/customers";
            if (searchText) {
                url = "/customers?search=" + searchText;
            }

            const response = await api.get(url);
            setCustomers(response.data);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load customers.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers("");
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchCustomers(value);
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await api.delete("/customers/" + selectedCustomer._id);

            setDeleteModalOpen(false);
            setSelectedCustomer(null);
            fetchCustomers(search);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete customer.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                    <p className="text-sm text-gray-500">
                        {isEmployee ? "View and add customers" : "Manage customer records"}
                    </p>
                </div>

                <Link
                    to="/customers/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add Customer
                </Link>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, or phone..."
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
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Address</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{customer.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{customer.email || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{customer.phone || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{customer.address || "-"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {!isEmployee && (
                                                        <>
                                                            <Link
                                                                to={"/customers/edit/" + customer._id}
                                                                className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => openDeleteModal(customer)}
                                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    {isEmployee && (
                                                        <span className="text-xs text-gray-400">View only</span>
                                                    )}
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

            {!isEmployee && (
                <ConfirmDelete
                    isOpen={deleteModalOpen}
                    title="Delete Customer"
                    message={"Are you sure you want to delete \"" + (selectedCustomer ? selectedCustomer.name : "") + "\"?"}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteModalOpen(false)}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}

export default CustomerList;
