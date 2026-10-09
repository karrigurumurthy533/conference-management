
import React, { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((previous) => !previous);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      {/* Responsive sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content area */}
      <div className="min-h-screen min-w-0 lg:pl-[220px]">
        {/* Sticky navbar */}
        <AdminNavbar
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page content */}
        <main className="min-w-0 p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;