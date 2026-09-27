import React from "react";

import { Search, Bell, ChevronDown, UserCircle } from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white/90 px-5 backdrop-blur-xl">
      {/* Search */}
      <div className="relative w-[360px]">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-[#f8f8fc] pl-10 pr-4 text-xs text-gray-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-purple-600">
          <Bell size={19} />

          <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="h-7 w-px bg-gray-200" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition hover:bg-gray-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <UserCircle size={21} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-gray-800">Admin</p>

            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>

          <ChevronDown size={15} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
