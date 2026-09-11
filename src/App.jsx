import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { resetDemoData } from "./services/api.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import UserList from "./pages/users/UserList.jsx";
import AddUser from "./pages/users/AddUser.jsx";
import EditUser from "./pages/users/EditUser.jsx";
import CategoryList from "./pages/categories/CategoryList.jsx";
import AddCategory from "./pages/categories/AddCategory.jsx";
import EditCategory from "./pages/categories/EditCategory.jsx";
import ProductList from "./pages/products/ProductList.jsx";
import AddProduct from "./pages/products/AddProduct.jsx";
import EditProduct from "./pages/products/EditProduct.jsx";
import ViewProduct from "./pages/products/ViewProduct.jsx";
import SupplierList from "./pages/suppliers/SupplierList.jsx";
import AddSupplier from "./pages/suppliers/AddSupplier.jsx";
import EditSupplier from "./pages/suppliers/EditSupplier.jsx";
import PurchaseList from "./pages/purchases/PurchaseList.jsx";
import AddPurchase from "./pages/purchases/AddPurchase.jsx";
import CustomerList from "./pages/customers/CustomerList.jsx";
import AddCustomer from "./pages/customers/AddCustomer.jsx";
import EditCustomer from "./pages/customers/EditCustomer.jsx";
import SalesList from "./pages/sales/SalesList.jsx";
import AddSale from "./pages/sales/AddSale.jsx";
import ExpenseList from "./pages/expenses/ExpenseList.jsx";
import AddExpense from "./pages/expenses/AddExpense.jsx";
import EditExpense from "./pages/expenses/EditExpense.jsx";
import Reports from "./pages/Reports.jsx";

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
