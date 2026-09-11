import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

function DashboardLayout() {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get logged-in user from localStorage
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Stop the page behind the mobile menu from scrolling while the menu is open.
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Always restore normal scrolling when this layout is removed.
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [sidebarOpen]);

    return (
        <div className="h-screen max-w-full overflow-hidden bg-slate-50 text-slate-800">
            <Navbar user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex h-[calc(100vh-72px)]">
                <Sidebar
                    user={user}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:ml-[272px]">
                    {/* Mobile menu button */}
                    <div className="hidden border-b border-gray-200 bg-white p-3 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            ☰ Menu
                        </button>
                    </div>

                    <main className="min-w-0 max-w-full flex-1 p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
