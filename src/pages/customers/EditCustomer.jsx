import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

function EditCustomer() {

    const navigate = useNavigate();
    const params = useParams();
    const customerId = params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/customers/" + customerId);

                setName(response.data.name);
                setEmail(response.data.email || "");
                setPhone(response.data.phone || "");
                setAddress(response.data.address || "");

            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to load customer.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {

            await api.put("/customers/" + customerId, {
                name: name,
                email: email,
                phone: phone,
                address: address,
            });

            navigate("/customers");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update customer.");
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
                <h2 className="text-2xl font-bold text-gray-800">Edit Customer</h2>
                <p className="text-sm text-gray-500">Update customer information</p>
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
                            Customer Name *
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
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
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
                        {saving ? "Updating..." : "Update Customer"}
                    </button>

                    <Link
                        to="/customers"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default EditCustomer;
