import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { IMAGE_BASE_URL } from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ConfirmDelete from "../../components/ConfirmDelete.jsx";

function ProductList() {

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const isEmployee = user && user.role === "Employee";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchProducts = async (searchText) => {
        try {
            setLoading(true);
            setError("");

            let url = "/products";
            if (searchText) {
                url = "/products?search=" + searchText;
            }

            const response = await api.get(url);
            setProducts(response.data);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load products.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts("");
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchProducts(value);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await api.delete("/products/" + selectedProduct._id);

            setDeleteModalOpen(false);
            setSelectedProduct(null);
            fetchProducts(search);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete product.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const getStockBadge = (quantity) => {
        if (quantity <= 0) {
            return "bg-red-100 text-red-700";
        }
        if (quantity <= 10) {
            return "bg-yellow-100 text-yellow-700";
        }
        return "bg-green-100 text-green-700";
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <p className="text-sm text-gray-500">
                        {isEmployee ? "View product inventory" : "Manage product inventory"}
                    </p>
                </div>

                {!isEmployee && (
                    <Link
                        to="/products/add"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Add Product
                    </Link>
                )}
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
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Image</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Buy Price</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Sell Price</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {product.image ? (
                                                    <img
                                                        src={IMAGE_BASE_URL + "/" + product.image}
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {product.category ? product.category.name : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">${product.buyingPrice}</td>
                                            <td className="px-4 py-3 text-gray-600">${product.sellingPrice}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStockBadge(product.quantity)}`}>
                                                    {product.quantity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={"/products/view/" + product._id}
                                                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                    >
                                                        View
                                                    </Link>
                                                    {!isEmployee && (
                                                        <>
                                                            <Link
                                                                to={"/products/edit/" + product._id}
                                                                className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => openDeleteModal(product)}
                                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
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
                    title="Delete Product"
                    message={"Are you sure you want to delete \"" + (selectedProduct ? selectedProduct.name : "") + "\"?"}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteModalOpen(false)}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}

export default ProductList;
