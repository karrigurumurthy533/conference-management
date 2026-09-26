import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f7fc]">

      {/* ================= SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="ml-[250px] min-h-screen">

        {/* ================= NAVBAR ================= */}
        <AdminNavbar />

        {/* ================= PAGE CONTENT ================= */}
        <main className="px-5 pt-3 pb-5">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;