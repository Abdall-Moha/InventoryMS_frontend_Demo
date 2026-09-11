import { NavLink } from "react-router-dom";
import {
  HiArrowRightOnRectangle,
  HiBuildingStorefront,
  HiChartBarSquare,
  HiCube,
  HiDocumentText,
  HiFolder,
  HiShoppingBag,
  HiTag,
  HiTruck,
  HiUsers,
  HiUserGroup,
  HiUserCircle,
  HiXMark,
} from "react-icons/hi2";

function Sidebar({ user, isOpen, onClose, onLogout }) {
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${isActive ? "bg-white text-slate-900 shadow-lg shadow-black/10" : "text-slate-400 hover:bg-white/10 hover:text-white"}`;
  const isAdmin = user && user.role === "Admin";
  const isEmployee = user && user.role === "Employee";
  const closeMenu = () => onClose();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[292px] flex-col bg-slate-950 px-4 py-5 shadow-2xl transition-transform duration-300 lg:left-0 lg:right-auto lg:top-[72px] lg:z-30 lg:h-[calc(100vh-72px)] lg:w-[272px] lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-7 flex items-center justify-between px-2 lg:hidden">
          <div className="flex items-center gap-2 text-white">
            <HiBuildingStorefront className="text-xl text-indigo-400" />
            <span className="font-semibold">Navigation</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-lg text-white"
          >
            <HiXMark />
          </button>
        </div>
        <div className="mb-6 hidden px-2 lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
        </div>
        <nav className="space-y-1.5 overflow-y-auto">
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            <HiChartBarSquare className="text-lg" /> Dashboard
          </NavLink>
          {!isEmployee && (
            <>
              <p className="px-3.5 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Catalog
              </p>
              <NavLink
                to="/categories"
                className={linkClass}
                onClick={closeMenu}
              >
                <HiFolder className="text-lg" /> Categories
              </NavLink>
              <NavLink
                to="/suppliers"
                className={linkClass}
                onClick={closeMenu}
              >
                <HiTruck className="text-lg" /> Suppliers
              </NavLink>
            </>
          )}
          <NavLink to="/products" className={linkClass} onClick={closeMenu}>
            <HiCube className="text-lg" /> Products
          </NavLink>
          <NavLink to="/customers" className={linkClass} onClick={closeMenu}>
            <HiUserGroup className="text-lg" /> Customers
          </NavLink>
          <p className="px-3.5 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Operations
          </p>
          <NavLink to="/sales" className={linkClass} onClick={closeMenu}>
            <HiShoppingBag className="text-lg" /> Sales
          </NavLink>
          {!isEmployee && (
            <>
              <NavLink
                to="/purchases"
                className={linkClass}
                onClick={closeMenu}
              >
                <HiTag className="text-lg" /> Purchases
              </NavLink>
              <NavLink to="/expenses" className={linkClass} onClick={closeMenu}>
                <HiDocumentText className="text-lg" /> Expenses
              </NavLink>
            </>
          )}
          {isAdmin && (
            <>
              <p className="px-3.5 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Administration
              </p>
              <NavLink to="/reports" className={linkClass} onClick={closeMenu}>
                <HiChartBarSquare className="text-lg" /> Reports
              </NavLink>
              <NavLink to="/users" className={linkClass} onClick={closeMenu}>
                <HiUsers className="text-lg" /> Users
              </NavLink>
            </>
          )}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4 lg:hidden">
          <div className="mb-3 flex items-center gap-3 px-3">
            <HiUserCircle className="text-3xl text-indigo-400" />
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-rose-500/10 px-3.5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
          >
            <HiArrowRightOnRectangle className="text-lg" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
