import { useEffect, useState } from "react";
import {
  HiChartBarSquare,
  HiCurrencyDollar,
  HiDocumentArrowDown,
  HiPrinter,
  HiShoppingBag,
  HiWallet,
} from "react-icons/hi2";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";

function Reports() {
  const [report, setReport] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [employee, setEmployee] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  const formatMoney = (amount) => {
    return "$" + Number(amount || 0).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Load the report using the selected filters.
  const fetchReport = async (page) => {
    try {
      setLoading(true);
      setError("");

      let url = "/reports?page=" + page + "&limit=10";

      if (from) url = url + "&from=" + from;
      if (to) url = url + "&to=" + to;
      if (paymentMethod) url = url + "&paymentMethod=" + paymentMethod;
      if (employee) url = url + "&employee=" + employee;
      if (customer) url = url + "&customer=" + customer;

      const response = await api.get(url);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const customerResponse = await api.get("/customers");
        setCustomers(customerResponse.data);

        const employeeResponse = await api.get("/users/employees");
        setEmployees(employeeResponse.data);
      } catch (err) {
        setError("Failed to load report filters.");
      }
    };

    fetchFilterData();
    fetchReport(1);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setSelectedSale(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleGenerateReport = (event) => {
    event.preventDefault();
    setError("");

    if (to && !from) {
      setError("Please select the From date first.");
      return;
    }

    if (from && to && new Date(to + "T00:00:00") < new Date(from + "T00:00:00")) {
      setError("To date cannot be earlier than From date.");
      return;
    }

    fetchReport(1);
  };

  if (loading && !report) return <Loader />;

  const summaryCards = [];

  if (report) {
    summaryCards.push(
      { title: "Total Revenue", value: report.summary.totalRevenue, icon: HiCurrencyDollar, color: "bg-emerald-50 text-emerald-700" },
      { title: "Total COGS", value: report.summary.totalCOGS, icon: HiShoppingBag, color: "bg-orange-50 text-orange-700" },
      { title: "Gross Profit", value: report.summary.totalGrossProfit, icon: HiChartBarSquare, color: "bg-indigo-50 text-indigo-700" }
    );

    if (report.showBusinessCosts) {
      summaryCards.push(
        { title: "Total Purchases", value: report.summary.totalPurchases, icon: HiShoppingBag, color: "bg-amber-50 text-amber-700" },
        { title: "Total Expenses", value: report.summary.totalExpenses, icon: HiWallet, color: "bg-rose-50 text-rose-700" },
        { title: "Net Profit", value: report.summary.totalNetProfit, icon: HiCurrencyDollar, color: "bg-teal-50 text-teal-700" }
      );
    }

    summaryCards.push(
      { title: "Total Sales", value: report.summary.totalSales, icon: HiShoppingBag, color: "bg-sky-50 text-sky-700", isNumber: true },
      { title: "Total Invoices", value: report.summary.totalInvoices, icon: HiDocumentArrowDown, color: "bg-cyan-50 text-cyan-700", isNumber: true }
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/10 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="mt-2 text-sm text-slate-300">
          Analyze your supermarket business using a selected date range.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800">Report Filters</h3>
          <p className="mt-1 text-sm text-slate-500">Choose filters, then generate the report.</p>
        </div>
        <form onSubmit={handleGenerateReport} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date From</label>
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date To</label>
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="">All</option>
              <option value="EVC">EVC</option>
              <option value="E-Dahab">E-Dahab</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Employee</label>
            <select value={employee} onChange={(event) => setEmployee(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="">All Employees</option>
              {employees.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Customer</label>
            <select value={customer} onChange={(event) => setCustomer(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="">All Customers</option>
              {customers.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>
      </section>

      {report && (
        <>
          <section>
            <div className="mb-4"><h3 className="text-lg font-bold text-slate-800">Business Summary</h3></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${card.color}`}><Icon /></div><p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{card.isNumber ? card.value : formatMoney(card.value)}</p><p className="mt-1 font-semibold text-slate-700">{card.title}</p></div>;
              })}
            </div>
          </section>

          <section>
            <div className="mb-4"><h3 className="text-lg font-bold text-slate-800">Payment Method Summary</h3></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {["Cash", "EVC", "E-Dahab", "Bank"].map((method) => <div key={method} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-700">{method}</p><p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{formatMoney(report.paymentSummary[method])}</p></div>)}
            </div>
          </section>

          <section className="grid gap-7 xl:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold text-slate-800">Top Selling Products</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Quantity Sold</th><th className="px-5 py-3">Revenue</th></tr></thead><tbody>{report.topProducts.length === 0 ? <tr><td colSpan="3" className="px-5 py-8 text-center text-slate-500">No products sold.</td></tr> : report.topProducts.map((item) => <tr key={item.product} className="border-t border-slate-100"><td className="px-5 py-3.5 font-medium text-slate-700">{item.product}</td><td className="px-5 py-3.5 text-slate-600">{item.quantitySold}</td><td className="px-5 py-3.5 font-semibold text-slate-800">{formatMoney(item.revenue)}</td></tr>)}</tbody></table></div></div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold text-slate-800">Top Customers</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Invoices</th><th className="px-5 py-3">Amount Spent</th></tr></thead><tbody>{report.topCustomers.length === 0 ? <tr><td colSpan="3" className="px-5 py-8 text-center text-slate-500">No customer sales found.</td></tr> : report.topCustomers.map((item) => <tr key={item.customer} className="border-t border-slate-100"><td className="px-5 py-3.5 font-medium text-slate-700">{item.customer}</td><td className="px-5 py-3.5 text-slate-600">{item.invoices}</td><td className="px-5 py-3.5 font-semibold text-slate-800">{formatMoney(item.amountSpent)}</td></tr>)}</tbody></table></div></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold text-slate-800">Employee Performance</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Invoices Created</th><th className="px-5 py-3">Revenue</th><th className="px-5 py-3">Profit</th></tr></thead><tbody>{report.employeePerformance.length === 0 ? <tr><td colSpan="4" className="px-5 py-8 text-center text-slate-500">No employee sales found.</td></tr> : report.employeePerformance.map((item) => <tr key={item.employee} className="border-t border-slate-100"><td className="px-5 py-3.5 font-medium text-slate-700">{item.employee}</td><td className="px-5 py-3.5 text-slate-600">{item.invoicesCreated}</td><td className="px-5 py-3.5 font-semibold text-slate-800">{formatMoney(item.revenue)}</td><td className="px-5 py-3.5 font-semibold text-slate-800">{formatMoney(item.profit)}</td></tr>)}</tbody></table></div></section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold text-slate-800">Sales Report</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Invoice Number</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Payment Method</th><th className="px-5 py-3">Total Amount</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">View</th></tr></thead><tbody>{report.sales.length === 0 ? <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-500">No sales found.</td></tr> : report.sales.map((sale) => <tr key={sale._id} className="border-t border-slate-100"><td className="px-5 py-3.5 font-semibold text-indigo-600">{sale.invoiceNumber}</td><td className="px-5 py-3.5 text-slate-600">{sale.customer ? sale.customer.name : "Walk-in Customer"}</td><td className="px-5 py-3.5 text-slate-600">{sale.createdBy ? sale.createdBy.name : "-"}</td><td className="px-5 py-3.5 text-slate-600">{sale.paymentMethod}</td><td className="px-5 py-3.5 font-semibold text-slate-800">{formatMoney(sale.totalAmount)}</td><td className="px-5 py-3.5 text-slate-500">{formatDate(sale.createdAt)}</td><td className="px-5 py-3.5"><button onClick={() => setSelectedSale(sale)} className="text-indigo-600 hover:text-indigo-700">View</button></td></tr>)}</tbody></table></div></section>

          <section className="flex flex-col gap-3 sm:flex-row"><button type="button" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export PDF</button><button type="button" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export Excel</button><button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><HiPrinter /> Print Report</button></section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Showing {report.totalSales === 0 ? 0 : ((report.currentPage - 1) * report.limit) + 1}-{Math.min(report.currentPage * report.limit, report.totalSales)} of {report.totalSales} sales</p><div className="flex gap-2"><button onClick={() => fetchReport(report.currentPage - 1)} disabled={report.currentPage === 1 || loading} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-50">Previous</button><button onClick={() => fetchReport(report.currentPage + 1)} disabled={report.currentPage === report.totalPages || report.totalPages === 0 || loading} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-50">Next</button></div></div>
        </>
      )}

      {selectedSale && <div onClick={() => setSelectedSale(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg"><div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-bold text-slate-800">Invoice Details</h3><button onClick={() => setSelectedSale(null)} className="text-sm text-slate-500 hover:text-slate-700">Close</button></div><div className="mb-5 grid gap-3 text-sm sm:grid-cols-2"><p className="text-slate-600">Invoice Number: <span className="font-medium text-slate-800">{selectedSale.invoiceNumber}</span></p><p className="text-slate-600">Customer: <span className="font-medium text-slate-800">{selectedSale.customer ? selectedSale.customer.name : "Walk-in Customer"}</span></p><p className="text-slate-600">Employee: <span className="font-medium text-slate-800">{selectedSale.createdBy ? selectedSale.createdBy.name : "-"}</span></p><p className="text-slate-600">Payment Method: <span className="font-medium text-slate-800">{selectedSale.paymentMethod}</span></p><p className="text-slate-600">Date: <span className="font-medium text-slate-800">{formatDate(selectedSale.createdAt)}</span></p></div><div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Unit Price</th><th className="px-4 py-3">Item Total</th></tr></thead><tbody>{selectedSale.items.map((item, index) => <tr key={index} className="border-b border-slate-100"><td className="px-4 py-3">{item.product ? item.product.name : "-"}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{formatMoney(item.unitPrice)}</td><td className="px-4 py-3">{formatMoney(item.total)}</td></tr>)}</tbody></table></div><div className="mt-5 text-right"><p className="text-sm text-slate-600">Invoice Total</p><p className="text-2xl font-bold text-emerald-700">{formatMoney(selectedSale.totalAmount)}</p></div></div></div>}
    </div>
  );
}

export default Reports;
