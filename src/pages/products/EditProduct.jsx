import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { IMAGE_BASE_URL } from "../../services/api";
import Loader from "../../components/Loader";

function EditProduct() {

    const navigate = useNavigate();
    const params = useParams();
    const productId = params.id;

    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");
    const [buyingPrice, setBuyingPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [image, setImage] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const categoryResponse = await api.get("/categories");
                setCategories(categoryResponse.data);

                const supplierResponse = await api.get("/suppliers");
                setSuppliers(supplierResponse.data);

                const productResponse = await api.get("/products/" + productId);
                const product = productResponse.data;

                setName(product.name);
                setCategory(product.category._id || product.category);

                if (product.supplier) {
                    setSupplier(product.supplier._id || product.supplier);
                } else {
                    setSupplier("");
                }
                setBuyingPrice(product.buyingPrice);
                setSellingPrice(product.sellingPrice);
                setQuantity(product.quantity);
                setDescription(product.description || "");
                setCurrentImage(product.image || "");

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

        fetchData();
    }, [productId]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
        } else {
            setImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {

            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);

            if (supplier) {
                formData.append("supplier", supplier);
            } else {
                formData.append("supplier", "none");
            }

            formData.append("buyingPrice", buyingPrice);
            formData.append("sellingPrice", sellingPrice);
            formData.append("quantity", quantity);
            formData.append("description", description);

            // Only append image if user selected a new file
            if (image) {
                formData.append("image", image);
            }

            await api.put("/products/" + productId, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/products");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update product.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <p className="text-sm text-gray-500">Update product information</p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Product Name *
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
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
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
                            {suppliers.map((sup) => (
                                <option key={sup._id} value={sup._id}>
                                    {sup.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Buying Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={buyingPrice}
                            onChange={(e) => setBuyingPrice(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Selling Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Product Image
                        </label>

                        {currentImage && !image && (
                            <div className="mb-2">
                                <img
                                    src={IMAGE_BASE_URL + "/" + currentImage}
                                    alt="Current product"
                                    className="h-20 w-20 rounded-lg object-cover"
                                />
                                <p className="mt-1 text-xs text-gray-400">Current image</p>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700"
                        />
                        <p className="mt-1 text-xs text-gray-400">Optional. Leave empty to keep current image.</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
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
                        {saving ? "Updating..." : "Update Product"}
                    </button>

                    <Link
                        to="/products"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;
