import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

function EditUser() {

    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Employee");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/users/" + userId);

                setName(response.data.name);
                setEmail(response.data.email);
                setRole(response.data.role);

            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to load user.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {

            const updateData = {
                name: name,
                email: email,
                role: role,
            };

            // Only send password if user entered a new one
            if (password.trim() !== "") {
                updateData.password = password;
            }

            await api.put("/users/" + userId, updateData);

            navigate("/users");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update user.");
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
                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                <p className="text-sm text-gray-500">Update user information</p>
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
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Role *
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update User"}
                    </button>

                    <Link
                        to="/users"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default EditUser;
