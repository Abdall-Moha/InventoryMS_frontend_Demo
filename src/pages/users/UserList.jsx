import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";

function UserList() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchUsers = async (searchText) => {
        try {
            setLoading(true);
            setError("");

            let url = "/users";
            if (searchText) {
                url = "/users?search=" + searchText;
            }

            const response = await api.get(url);
            setUsers(response.data);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load users.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers("");
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchUsers(value);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await api.delete("/users/" + selectedUser._id);

            setDeleteModalOpen(false);
            setSelectedUser(null);
            fetchUsers(search);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete user.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        if (role === "Admin") {
            return "bg-purple-100 text-purple-700";
        }
        if (role === "Manager") {
            return "bg-blue-100 text-blue-700";
        }
        return "bg-green-100 text-green-700";
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                    <p className="text-sm text-gray-500">Manage system users (Admin only)</p>
                </div>

                <Link
                    to="/users/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add User
                </Link>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name or email..."
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
                                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={"/users/edit/" + user._id}
                                                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
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
                title="Delete User"
                message={"Are you sure you want to delete " + (selectedUser ? selectedUser.name : "this user") + "?"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                loading={deleteLoading}
            />
        </div>
    );
}

export default UserList;
