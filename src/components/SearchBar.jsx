import { HiMagnifyingGlass } from "react-icons/hi2";

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative w-full max-w-md">
            <input type="text" value={value} onChange={onChange} placeholder={placeholder || "Search..."} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><HiMagnifyingGlass className="text-lg" /></span>
        </div>
    );
}

export default SearchBar;
