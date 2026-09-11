import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { IMAGE_BASE_URL } from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

function ViewProduct() {

    const params = useParams();
    const productId = params.id;

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const isEmployee = user && user.role === "Employee";

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products/" + productId);
                setProduct(response.data);

            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to load product.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
            </div>
        );
    }

    const getStockLabel = (quantity) => {
        if (quantity <= 0) {
            return { text: "Out of Stock", color: "bg-red-100 text-red-700" };
        }
        if (quantity <= 10) {
            return { text: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
        }
        return { text: "In Stock", color: "bg-green-100 text-green-700" };
    };

    const stockInfo = getStockLabel(product.quantity);

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                    <p className="text-sm text-gray-500">View full product information</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        to="/products"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back to List
                    </Link>

                    {!isEmployee && (
                        <Link
                            to={"/products/edit/" + product._id}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Edit Product
                        </Link>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="flex items-center justify-center bg-gray-50 p-8 md:col-span-1">
                        {product.image ? (
                            <img
                                src={IMAGE_BASE_URL + "/" + product.image}
                                alt={product.name}
                                className="max-h-64 rounded-xl object-cover shadow-md"
                            />
                        ) : (
                            <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:col-span-2">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${stockInfo.color}`}>
                                {stockInfo.text} ({product.quantity})
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {product.category ? product.category.name : "-"}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Supplier</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {product.supplier ? product.supplier.name : "-"}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Buying Price</p>
                                <p className="mt-1 font-medium text-gray-800">${product.buyingPrice}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Selling Price</p>
                                <p className="mt-1 font-medium text-gray-800">${product.sellingPrice}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Profit Per Unit</p>
                                <p className="mt-1 font-medium text-green-700">
                                    ${(product.sellingPrice - product.buyingPrice).toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                                </p>
                            </div>
                        </div>

                        {product.description && (
                            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Description</p>
                                <p className="mt-1 text-sm text-gray-700">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;
