import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddPurchase() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [product, setProduct] = useState("");
    const [supplier, setSupplier] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get("/products");
                setProducts(productResponse.data);

                const supplierResponse = await api.get("/suppliers");
                setSuppliers(supplierResponse.data);

            } catch (err) {
                setError("Failed to load products or suppliers.");
            }
        };

        fetchData();
    }, []);

    // When user selects a product, auto-fill unit price and supplier
    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        setProduct(selectedProductId);

        const selectedProduct = products.find((item) => item._id === selectedProductId);

        if (selectedProduct) {
            setUnitPrice(selectedProduct.buyingPrice);

            if (selectedProduct.supplier) {
                const supplierId = selectedProduct.supplier._id || selectedProduct.supplier;
                setSupplier(supplierId);
            } else {
                setSupplier("");
            }
        }
    };

    const calculateTotal = () => {
        const qty = Number(quantity);
        const price = Number(unitPrice);

        if (isNaN(qty) || isNaN(price)) {
            return "0.00";
        }

        return (qty * price).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            await api.post("/purchases", {
                product: product,
                supplier: supplier,
                quantity: quantity,
                unitPrice: unitPrice,
                notes: notes,
            });

            navigate("/purchases");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create purchase.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add Purchase</h2>
                <p className="text-sm text-gray-500">Record a stock purchase — quantity will be added to product automatically</p>
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
                            Product *
                        </label>
                        <select
                            value={product}
                            onChange={handleProductChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select a product</option>
                            {products.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name} (Stock: {item.quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Supplier
                        </label>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">None</option>
                            {suppliers.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="How many units purchased?"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Unit Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Price per unit"
                        />
                    </div>

                    <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-green-700">${calculateTotal()}</p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Optional notes about this purchase"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || products.length === 0}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Purchase"}
                    </button>

                    <Link
                        to="/purchases"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default AddPurchase;
