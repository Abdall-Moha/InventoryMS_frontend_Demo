import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { resetDemoData } from "./services/api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import CategoryList from "./pages/categories/CategoryList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ViewProduct from "./pages/products/ViewProduct";
import SupplierList from "./pages/suppliers/SupplierList";
import AddSupplier from "./pages/suppliers/AddSupplier";
import EditSupplier from "./pages/suppliers/EditSupplier";
import PurchaseList from "./pages/purchases/PurchaseList";
import AddPurchase from "./pages/purchases/AddPurchase";
import CustomerList from "./pages/customers/CustomerList";
import AddCustomer from "./pages/customers/AddCustomer";
import EditCustomer from "./pages/customers/EditCustomer";
import SalesList from "./pages/sales/SalesList";
import AddSale from "./pages/sales/AddSale";
import ExpenseList from "./pages/expenses/ExpenseList";
import AddExpense from "./pages/expenses/AddExpense";
import EditExpense from "./pages/expenses/EditExpense";
import Reports from "./pages/Reports";

// Protect routes - redirect to login if no token
function ProtectedRoute({ children }) {
    return children;
}

// Only Admin can access user management pages
function AdminRoute({ children }) {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || user.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Admin and Manager can access category management
// Employee cannot access categories
function ManagerRoute({ children }) {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || user.role === "Employee") {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    useEffect(() => {
        if (!localStorage.getItem("token") || !localStorage.getItem("user")) resetDemoData();
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />

                <Route
                    path="categories"
                    element={
                        <ManagerRoute>
                            <CategoryList />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="categories/add"
                    element={
                        <ManagerRoute>
                            <AddCategory />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="categories/edit/:id"
                    element={
                        <ManagerRoute>
                            <EditCategory />
                        </ManagerRoute>
                    }
                />

                <Route path="products" element={<ProductList />} />
                <Route
                    path="products/add"
                    element={
                        <ManagerRoute>
                            <AddProduct />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="products/edit/:id"
                    element={
                        <ManagerRoute>
                            <EditProduct />
                        </ManagerRoute>
                    }
                />
                <Route path="products/view/:id" element={<ViewProduct />} />

                <Route
                    path="suppliers"
                    element={
                        <ManagerRoute>
                            <SupplierList />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="suppliers/add"
                    element={
                        <ManagerRoute>
                            <AddSupplier />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="suppliers/edit/:id"
                    element={
                        <ManagerRoute>
                            <EditSupplier />
                        </ManagerRoute>
                    }
                />

                <Route
                    path="purchases"
                    element={
                        <ManagerRoute>
                            <PurchaseList />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="purchases/add"
                    element={
                        <ManagerRoute>
                            <AddPurchase />
                        </ManagerRoute>
                    }
                />

                <Route path="customers" element={<CustomerList />} />
                <Route path="customers/add" element={<AddCustomer />} />
                <Route
                    path="customers/edit/:id"
                    element={
                        <ManagerRoute>
                            <EditCustomer />
                        </ManagerRoute>
                    }
                />

                <Route path="sales" element={<SalesList />} />
                <Route path="sales/add" element={<AddSale />} />

                <Route
                    path="reports"
                    element={
                        <AdminRoute>
                            <Reports />
                        </AdminRoute>
                    }
                />

                <Route
                    path="expenses"
                    element={
                        <ManagerRoute>
                            <ExpenseList />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="expenses/add"
                    element={
                        <ManagerRoute>
                            <AddExpense />
                        </ManagerRoute>
                    }
                />
                <Route
                    path="expenses/edit/:id"
                    element={
                        <ManagerRoute>
                            <EditExpense />
                        </ManagerRoute>
                    }
                />

                <Route
                    path="users"
                    element={
                        <AdminRoute>
                            <UserList />
                        </AdminRoute>
                    }
                />
                <Route
                    path="users/add"
                    element={
                        <AdminRoute>
                            <AddUser />
                        </AdminRoute>
                    }
                />
                <Route
                    path="users/edit/:id"
                    element={
                        <AdminRoute>
                            <EditUser />
                        </AdminRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
