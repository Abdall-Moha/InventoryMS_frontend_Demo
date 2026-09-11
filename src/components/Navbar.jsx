import { HiArrowRightOnRectangle, HiBars3, HiUserCircle } from "react-icons/hi2";

function Navbar({ user, onLogout, onMenuClick }) {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-500/25">I</div>
                    <div><h1 className="text-base font-bold tracking-tight text-slate-900">Inventory MS</h1><p className="text-xs font-medium text-slate-500">Supermarket management</p></div>
                </div>
                <div className="flex items-center gap-3">
                    {user && <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-2 pr-3 sm:flex"><HiUserCircle className="text-3xl text-indigo-500" /><div className="leading-tight"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{user.role}</p></div></div>}
                    <button onClick={onLogout} className="hidden items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 lg:inline-flex"><HiArrowRightOnRectangle className="text-lg" /> Logout</button>
                    <button onClick={onMenuClick} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-xl text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 lg:hidden"><HiBars3 /></button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
