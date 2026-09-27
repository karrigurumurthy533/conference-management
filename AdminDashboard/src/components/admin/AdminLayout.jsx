import React from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f8fc]">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="ml-[220px] min-h-screen">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="px-4 py-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;