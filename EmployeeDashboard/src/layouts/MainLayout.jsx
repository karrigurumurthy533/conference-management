import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ======================================================
  // CLOSE MOBILE SIDEBAR WHEN SCREEN BECOMES DESKTOP
  // ======================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // ======================================================
  // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
  // ======================================================

  useEffect(() => {
    if (
      isSidebarOpen &&
      window.innerWidth < 1024
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // ======================================================
  // TOGGLE SIDEBAR
  // ======================================================

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // ======================================================
  // CLOSE SIDEBAR
  // ======================================================

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7fb]">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* =====================================================
          MAIN CONTENT AREA
      ====================================================== */}

      <div
        className="
          ml-0
          min-h-screen
          min-w-0
          lg:ml-[220px]
        "
      >
        {/* =================================================
            NAVBAR
        ================================================== */}

        <Navbar
          onMenuClick={handleMenuClick}
          isSidebarOpen={isSidebarOpen}
        />

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main
          className="
            min-w-0
            pt-[70px]
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;