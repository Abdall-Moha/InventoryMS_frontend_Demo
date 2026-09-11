import { useEffect, useState } from "react";
import {
  HiArchiveBox,
  HiBuildingStorefront,
  HiChartBarSquare,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiFolder,
  HiShoppingBag,
  HiTruck,
  HiUserGroup,
  HiUsers,
  HiWallet,
} from "react-icons/hi2";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";

// Dashboard page - shows useful supermarket information collected from the database.
function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the logged-in user so the welcome message feels personal.
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // This function loads every dashboard section from one backend endpoint.
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Load the dashboard once when this page opens.
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Choose a friendly greeting based on the current hour.
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Reuse one simple function to display money consistently.
  const formatMoney = (amount) => {
    return "$" + Number(amount || 0).toFixed(2);
  };

  // Reuse one simple function for dates in the tables.
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-medium text-rose-700">
        {error}
      </div>
    );
  }

  // Employees receive a focused dashboard with only their own sales activity.
  if (user && user.role === "Employee") {
    return (
      <div className="mx-auto max-w-5xl space-y-7">
        <section className="rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/10 sm:px-8">
          <p className="text-sm font-semibold text-indigo-300">
            {getGreeting()}
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            {user.name}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Employee ·{" "}
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
            <HiCurrencyDollar className="text-2xl" />
            <p className="mt-5 text-sm font-semibold">Today’s Sales</p>
            <p className="mt-1 text-3xl font-bold">
              {formatMoney(dashboard.todaySales)}
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-indigo-700">
            <HiShoppingBag className="text-2xl" />
            <p className="mt-5 text-sm font-semibold">Number of Sales Today</p>
            <p className="mt-1 text-3xl font-bold">
              {dashboard.salesCountToday}
            </p>
          </div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Your recent sales</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your latest five sales, newest first.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      You have not recorded any sales yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentSales.map((sale) => (
                    <tr key={sale._id} className="border-t border-slate-100">
                      <td className="px-5 py-3.5 font-semibold text-indigo-600">
                        INV-{sale._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {sale.customer
                          ? sale.customer.name
                          : "Walk-in Customer"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {formatMoney(sale.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {formatDate(sale.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <HiExclamationTriangle className="text-2xl text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-800">Low stock products</h3>
              <p className="text-sm text-slate-500">
                View only · {dashboard.lowStockProducts.length} product(s) need
                restocking.
              </p>
            </div>
          </div>
          {dashboard.lowStockProducts.length > 0 && (
            <div className="mt-4 space-y-2">
              {dashboard.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-xl bg-amber-50 px-3.5 py-3 text-sm"
                >
                  <span className="font-medium text-slate-700">
                    {product.name}
                  </span>
                  <span className="font-bold text-amber-700">
                    {product.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  const stats = dashboard.statistics;
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Products currently in inventory",
      icon: HiArchiveBox,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      description: "Product groups in your catalog",
      icon: HiFolder,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Total Suppliers",
      value: stats.totalSuppliers,
      description: "Active product suppliers",
      icon: HiTruck,
      color: "bg-sky-50 text-sky-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      description: "Customers in your records",
      icon: HiUserGroup,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      description: "Sales records created",
      icon: HiShoppingBag,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      description: "Stock purchases recorded",
      icon: HiBuildingStorefront,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      description: "Business costs recorded",
      icon: HiWallet,
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts,
      description: "Items with 5 or fewer left",
      icon: HiExclamationTriangle,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  // Only Admins can see the user count.
  if (user && user.role === "Admin") {
    statCards.splice(4, 0, {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Users with system access",
      icon: HiUsers,
      color: "bg-fuchsia-50 text-fuchsia-600",
    });
  }

  const performanceGroups = [
    {
      title: "Revenue",
      icon: HiCurrencyDollar,
      color: "border-emerald-100 bg-emerald-50 text-emerald-700",
      values: dashboard.businessPerformance.revenue,
    },
    {
      title: "Profit",
      icon: HiChartBarSquare,
      color: "border-indigo-100 bg-indigo-50 text-indigo-700",
      values: dashboard.businessPerformance.profit,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-300">
              {getGreeting()}
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {user ? user.name : "Welcome"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {user ? user.role : "User"} · Supermarket overview
            </p>
          </div>
          <p className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-slate-200">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      {user && user.role === "Manager" && (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
            <HiCurrencyDollar className="text-2xl" />
            <p className="mt-5 text-sm font-semibold">Today's Sales</p>
            <p className="mt-1 text-3xl font-bold">
              {formatMoney(dashboard.todaySales)}
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-indigo-700">
            <HiShoppingBag className="text-2xl" />
            <p className="mt-5 text-sm font-semibold">Number of Sales Today</p>
            <p className="mt-1 text-3xl font-bold">
              {dashboard.salesCountToday}
            </p>
          </div>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Business snapshot
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            A quick look at your supermarket records.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${card.color}`}
                >
                  <Icon />
                </div>
                <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {card.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {user && user.role === "Admin" && (
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Business Performance
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Revenue and profit calculated from completed sales.
            </p>
          </div>
          <div className="space-y-6">
            {performanceGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.title}>
                  <h4 className="mb-4 font-bold text-slate-800">
                    Business {group.title}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { title: "Today", value: group.values.today },
                      { title: "Yesterday", value: group.values.yesterday },
                      { title: "Last 7 Days", value: group.values.lastSevenDays },
                      { title: "This Month", value: group.values.thisMonth },
                    ].map((period) => (
                      <div
                        key={period.title}
                        className={`rounded-2xl border p-5 ${group.color}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{period.title}</p>
                          <Icon className="text-xl" />
                        </div>
                        <p className="mt-5 text-2xl font-bold tracking-tight">
                          {formatMoney(period.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-7 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Recent sales</h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest five sales, newest first.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentSales.map((sale) => (
                    <tr key={sale._id} className="border-t border-slate-100">
                      <td className="px-5 py-3.5 font-semibold text-indigo-600">
                        {sale.invoiceNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {sale.customer
                          ? sale.customer.name
                          : "Walk-in Customer"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {sale.createdBy ? sale.createdBy.name : "-"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {formatMoney(sale.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {formatDate(sale.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Recent purchases</h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest five stock purchases, newest first.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[470px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Supplier</th>
                  <th className="px-5 py-3 font-semibold">Total cost</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentPurchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No purchases recorded yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentPurchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {purchase.supplier
                          ? purchase.supplier.name
                          : "No supplier"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {formatMoney(purchase.totalAmount)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(purchase.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-bold text-slate-800">Low stock alert</h3>
            <p className="mt-1 text-sm text-slate-500">
              Products with a quantity of five or less need attention.
            </p>
          </div>
          <HiExclamationTriangle className="text-2xl text-amber-500" />
        </div>
        {dashboard.lowStockProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-xl text-emerald-600">
              ✓
            </div>
            <p className="mt-3 font-semibold text-slate-700">
              Everything is sufficiently stocked.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-amber-50 text-xs uppercase tracking-wide text-amber-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Current quantity</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.lowStockProducts.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        {product.quantity} left
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.category ? product.category.name : "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.supplier ? product.supplier.name : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
