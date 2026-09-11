import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

function SalesList() {

    const location = useLocation();
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedSale, setSelectedSale] = useState(null);
    const [customer, setCustomer] = useState("");
    const [employee, setEmployee] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [limit, setLimit] = useState(10);

    const formatMoney = (amount) => {
        return Number(amount || 0).toFixed(2);
    };

    const fetchSales = async (page) => {
        try {
            setLoading(true);
            setError("");

            let url = "/sales?page=" + page + "&limit=10";

            if (customer) {
                url = url + "&customer=" + customer;
            }

            if (employee) {
                url = url + "&employee=" + employee;
            }

            if (from) {
                url = url + "&from=" + from;
            }

            if (to) {
                url = url + "&to=" + to;
            }

            const response = await api.get(url);
            setSales(response.data.sales);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalSales(response.data.totalSales);
            setLimit(response.data.limit);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to load sales.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state && location.state.success) {
            setSuccess(location.state.success);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const customerResponse = await api.get("/customers");
                setCustomers(customerResponse.data);

                if (user && user.role !== "Employee") {
                    const employeeResponse = await api.get("/users/employees");
                    setEmployees(employeeResponse.data);
                }

            } catch (err) {
                setError("Failed to load customers or employees.");
            }
        };

        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchSales(1);
    }, [customer, employee, from, to]);

    const handlePageChange = (page) => {
        fetchSales(page);
    };

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                setSelectedSale(null);
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
                    <p className="text-sm text-gray-500">Sales history — stock reduces automatically</p>
                </div>

                <Link
                    to="/sales/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add Sale
                </Link>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    {success}
                </div>
            )}

            <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Customer</label>
                    <select
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">All Customers</option>
                        {customers.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                </div>

                {user && user.role !== "Employee" && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Employee</label>
                        <select
                            value={employee}
                            onChange={(e) => setEmployee(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">All Employees</option>
                            {employees.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date From</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date To</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice Number</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Customer</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Employee</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Number of Products</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Total Amount</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Payment Method</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            No sales found.
                                        </td>
                                    </tr>
                                ) : (
                                    sales.map((sale) => (
                                        <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {sale.invoiceNumber || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {sale.customer ? sale.customer.name : "Walk-in"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {sale.createdBy ? sale.createdBy.name : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {sale.items ? sale.items.length : 0}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-green-700">${formatMoney(sale.totalAmount)}</td>
                                            <td className="px-4 py-3 text-gray-600">{sale.paymentMethod || "Cash"}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setSelectedSale(sale)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {totalSales === 0 ? 0 : ((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalSales)} of {totalSales} sales
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={currentPage === page ? "rounded-lg bg-blue-600 px-3 py-2 text-sm text-white" : "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {selectedSale && (
                <div
                    onClick={() => setSelectedSale(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Invoice Details</h3>
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
                            <p className="text-gray-600">Invoice Number: <span className="font-medium text-gray-800">{selectedSale.invoiceNumber}</span></p>
                            <p className="text-gray-600">Customer: <span className="font-medium text-gray-800">{selectedSale.customer ? selectedSale.customer.name : "Walk-in"}</span></p>
                            <p className="text-gray-600">Employee: <span className="font-medium text-gray-800">{selectedSale.createdBy ? selectedSale.createdBy.name : "-"}</span></p>
                            <p className="text-gray-600">Payment Method: <span className="font-medium text-gray-800">{selectedSale.paymentMethod || "Cash"}</span></p>
                            <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{selectedSale.createdAt ? new Date(selectedSale.createdAt).toLocaleDateString() : "-"}</span></p>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Product</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Quantity</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Unit Price</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Item Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSale.items && selectedSale.items.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="px-4 py-3 text-gray-700">{item.product ? item.product.name : "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                                            <td className="px-4 py-3 text-gray-600">${formatMoney(item.unitPrice)}</td>
                                            <td className="px-4 py-3 text-gray-600">${formatMoney(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5 text-right">
                            <p className="text-sm text-gray-600">Invoice Total</p>
                            <p className="text-2xl font-bold text-green-700">${formatMoney(selectedSale.totalAmount)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesList;
