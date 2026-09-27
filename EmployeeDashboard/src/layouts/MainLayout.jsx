import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7fb]">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN CONTENT AREA
      ====================================================== */}
      <div className="ml-[220px] min-h-screen min-w-0">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;