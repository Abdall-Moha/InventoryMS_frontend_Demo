import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

function PurchaseList() {

    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [supplier, setSupplier] = useState("");
    const [product, setProduct] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPurchases, setTotalPurchases] = useState(0);
    const [limit, setLimit] = useState(10);

    const fetchPurchases = async (page) => {
        try {
            setLoading(true);
            setError("");

            if (dateTo && !dateFrom) {
                setError("Please select a start date first.");
                setLoading(false);
                return;
            }

            let url = "/purchases?page=" + page + "&limit=10";

            if (supplier) url = url + "&supplier=" + supplier;
            if (product) url = url + "&product=" + product;
            if (dateFrom) url = url + "&dateFrom=" + dateFrom;
            if (dateTo) url = url + "&dateTo=" + dateTo;

            const response = await api.get(url);
            setPurchases(response.data.purchases);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalPurchases(response.data.totalPurchases);
            setLimit(response.data.limit);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to load purchases.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const supplierResponse = await api.get("/suppliers");
                setSuppliers(supplierResponse.data);

                const productResponse = await api.get("/products");
                setProducts(productResponse.data);
            } catch (err) {
                setError("Failed to load purchase filters.");
            }
        };

        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchPurchases(1);
    }, [supplier, product, dateFrom, dateTo]);

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-2xl font-bold text-gray-800">Purchases</h2><p className="text-sm text-gray-500">Purchase history â€” stock increases automatically</p></div>
                <Link to="/purchases/add" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">+ Add Purchase</Link>
            </div>

            <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                <div><label className="mb-1 block text-sm font-medium text-gray-700">Date From</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                <div><label className="mb-1 block text-sm font-medium text-gray-700">Date To</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                <div><label className="mb-1 block text-sm font-medium text-gray-700">Supplier</label><select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">All Suppliers</option>{suppliers.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></div>
                <div><label className="mb-1 block text-sm font-medium text-gray-700">Product</label><select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">All Products</option>{products.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></div>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            {loading ? <Loader /> : <><div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-gray-200 bg-gray-50"><tr><th className="px-4 py-3 font-semibold text-gray-700">Date</th><th className="px-4 py-3 font-semibold text-gray-700">Product</th><th className="px-4 py-3 font-semibold text-gray-700">Supplier</th><th className="px-4 py-3 font-semibold text-gray-700">Quantity</th><th className="px-4 py-3 font-semibold text-gray-700">Unit Price</th><th className="px-4 py-3 font-semibold text-gray-700">Total</th><th className="px-4 py-3 font-semibold text-gray-700">Recorded By</th></tr></thead><tbody>{purchases.length === 0 ? <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No purchases found.</td></tr> : purchases.map((purchase) => <tr key={purchase._id} className="border-b border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-gray-600">{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : "-"}</td><td className="px-4 py-3 font-medium text-gray-800">{purchase.product ? purchase.product.name : "-"}</td><td className="px-4 py-3 text-gray-600">{purchase.supplier ? purchase.supplier.name : "-"}</td><td className="px-4 py-3 text-gray-600">{purchase.quantity}</td><td className="px-4 py-3 text-gray-600">${Number(purchase.unitPrice || 0).toFixed(2)}</td><td className="px-4 py-3 font-medium text-green-700">${Number(purchase.totalAmount || 0).toFixed(2)}</td><td className="px-4 py-3 text-gray-600">{purchase.createdBy ? purchase.createdBy.name : "-"}</td></tr>)}</tbody></table></div></div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-gray-500">Showing {totalPurchases === 0 ? 0 : ((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalPurchases)} of {totalPurchases} purchases</p><div className="flex items-center gap-2"><button onClick={() => fetchPurchases(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} onClick={() => fetchPurchases(page)} className={currentPage === page ? "rounded-lg bg-blue-600 px-3 py-2 text-sm text-white" : "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"}>{page}</button>)}<button onClick={() => fetchPurchases(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button></div></div></>}
        </div>
    );
}

export default PurchaseList;
