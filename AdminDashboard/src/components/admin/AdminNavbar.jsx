import React from "react";

import {
  Search,
  Bell,
  ChevronDown,
  UserCircle,
} from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between border-b border-gray-200 bg-white/90 px-6 backdrop-blur-xl">

      {/* Search */}
      <div className="relative w-[420px]">

        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-11 w-full rounded-xl border border-gray-200 bg-[#f8f8fc] pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />

      </div>


      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-purple-50 hover:text-purple-600">

          <Bell size={21} />

          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            3
          </span>

        </button>


        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />


        {/* Profile */}
        <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <UserCircle size={25} />
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>

          </div>

          <ChevronDown
            size={17}
            className="text-gray-400"
          />

        </button>

      </div>

    </header>
  );
};

export default AdminNavbar;