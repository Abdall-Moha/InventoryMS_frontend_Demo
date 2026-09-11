import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

function AddSale() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [product, setProduct] = useState("");
    const [customer, setCustomer] = useState("");
    const [quantity, setQuantity] = useState("");
    const [availableStock, setAvailableStock] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("EVC");
    const [invoiceItems, setInvoiceItems] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const formatMoney = (amount) => {
        return Number(amount || 0).toFixed(2);
    };

    const calculateItemTotal = (quantity, unitPrice) => {
        return Number((quantity * unitPrice).toFixed(2));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get("/products");
                setProducts(productResponse.data);

                const customerResponse = await api.get("/customers");
                setCustomers(customerResponse.data);

            } catch (err) {
                setError("Failed to load products or customers.");
            }
        };

        fetchData();
    }, []);

    // When user selects a product, show the available stock
    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        setProduct(selectedProductId);

        const selectedProduct = products.find((item) => item._id === selectedProductId);

        if (selectedProduct) {
            setAvailableStock(selectedProduct.quantity);
        } else {
            setAvailableStock(0);
        }
    };

    const handleAddProduct = () => {
        setError("");

        const qty = Number(quantity);

        if (!product) {
            setError("Please select a product.");
            return;
        }

        if (isNaN(qty) || qty <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        const selectedProduct = products.find((item) => item._id === product);

        if (qty > availableStock) {
            setError("Not enough stock. Available: " + availableStock);
            return;
        }

        const existingItem = invoiceItems.find((item) => item.product === product);

        if (existingItem && existingItem.quantity + qty > selectedProduct.quantity) {
            setError("Not enough stock. Available: " + selectedProduct.quantity);
            return;
        }

        if (existingItem) {
            setInvoiceItems(invoiceItems.map((item) => {
                if (item.product === product) {
                    const updatedQuantity = item.quantity + qty;

                    return {
                        ...item,
                        quantity: updatedQuantity,
                        total: calculateItemTotal(updatedQuantity, item.unitPrice),
                    };
                }

                return item;
            }));
        } else {
            setInvoiceItems([...invoiceItems, {
                product: selectedProduct._id,
                name: selectedProduct.name,
                quantity: qty,
                unitPrice: selectedProduct.sellingPrice,
                total: calculateItemTotal(qty, selectedProduct.sellingPrice),
            }]);
        }

        setProduct("");
        setQuantity("");
        setAvailableStock(0);
    };

    const handleRemoveProduct = (productId) => {
        setInvoiceItems(invoiceItems.filter((item) => item.product !== productId));
    };

    const handleIncreaseQuantity = (productId) => {
        const selectedProduct = products.find((item) => item._id === productId);
        const invoiceItem = invoiceItems.find((item) => item.product === productId);

        if (invoiceItem.quantity >= selectedProduct.quantity) {
            setError("Not enough stock. Available: " + selectedProduct.quantity);
            return;
        }

        setInvoiceItems(invoiceItems.map((item) => {
            if (item.product === productId) {
                const updatedQuantity = item.quantity + 1;

                return {
                    ...item,
                    quantity: updatedQuantity,
                    total: calculateItemTotal(updatedQuantity, item.unitPrice),
                };
            }

            return item;
        }));
    };

    const handleDecreaseQuantity = (productId) => {
        setInvoiceItems(invoiceItems.map((item) => {
            if (item.product === productId) {
                const updatedQuantity = item.quantity - 1;

                return {
                    ...item,
                    quantity: updatedQuantity,
                    total: calculateItemTotal(updatedQuantity, item.unitPrice),
                };
            }

            return item;
        }).filter((item) => item.quantity > 0));
    };

    const calculateInvoiceTotal = () => {
        let invoiceTotal = 0;

        for (let i = 0; i < invoiceItems.length; i++) {
            invoiceTotal = Number((invoiceTotal + invoiceItems[i].total).toFixed(2));
        }

        return invoiceTotal;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (invoiceItems.length === 0) {
            setError("Please add at least one product.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/sales", {
                customer: customer,
                paymentMethod: paymentMethod,
                items: invoiceItems.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                })),
            });

            setProduct("");
            setCustomer("");
            setQuantity("");
            setPaymentMethod("EVC");
            setInvoiceItems([]);
            setAvailableStock(0);
            navigate("/sales", { state: { success: "Sale created successfully." } });

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create sale.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add Sale</h2>
                <p className="text-sm text-gray-500">Record a sale — stock will be reduced automatically</p>
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select a product</option>
                            {products.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name} (Stock: {item.quantity})
                                </option>
                            ))}
                        </select>

                        {product && (
                            <p className="mt-1 text-xs text-gray-500">
                                Available stock: {availableStock} units
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Customer
                        </label>
                        <select
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Walk-in Customer</option>
                            {customers.map((item) => (
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
                            max={availableStock > 0 ? availableStock : undefined}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="How many units to sell?"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Add Product
                    </button>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="EVC">EVC</option>
                            <option value="E-Dahab">E-Dahab</option>
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                        <p className="mb-3 text-sm font-medium text-gray-700">Invoice Items</p>
                        {invoiceItems.length === 0 ? (
                            <p className="text-sm text-gray-500">No products added yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {invoiceItems.map((item) => (
                                    <div key={item.product} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-gray-700">{item.name}</p>
                                            <p className="text-gray-500">Selling Price: ${formatMoney(item.unitPrice)} · Total: ${formatMoney(item.total)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleDecreaseQuantity(item.product)} className="text-gray-600 hover:text-gray-700">-</button>
                                            <span className="text-gray-600">Qty: {item.quantity}</span>
                                            <button type="button" onClick={() => handleIncreaseQuantity(item.product)} className="text-gray-600 hover:text-gray-700">+</button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(item.product)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg bg-green-50 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">Invoice Summary</p>
                        <p className="text-sm text-gray-600">Products: {invoiceItems.length}</p>
                        <p className="text-sm text-gray-600">Subtotal: ${formatMoney(calculateInvoiceTotal())}</p>
                        <p className="text-sm text-gray-600">Payment Method: {paymentMethod}</p>
                        <p className="text-sm text-gray-600">Customer: {customer ? customers.find((item) => item._id === customer)?.name : "Walk-in Customer"}</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || products.length === 0 || invoiceItems.length === 0}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Sale"}
                    </button>

                    <Link
                        to="/sales"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default AddSale;
