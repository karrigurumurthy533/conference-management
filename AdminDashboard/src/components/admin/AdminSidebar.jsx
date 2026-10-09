
import { useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  ClipboardList,
  CreditCard,
  BarChart3,
  Mic2,
  Star,
  LogOut,
  FilePlus,
  Receipt,
  Download,
  FileText,
  Users,
  CalendarCheck,
  X,
} from "lucide-react";

import { logout } from "../../redux/authSlice";

const AdminSidebar = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Mobile sidebar open ayinappudu Escape key support
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Mobile drawer open ayinappudu background scroll prevent
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-2 py-1.5 text-[14px] font-medium whitespace-nowrap transition-all duration-200 ${
      isActive
        ? "bg-purple-50 text-[#7C3AED]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#7C3AED]"
    }`;

  const iconClass = ({ isActive }) =>
    `shrink-0 transition-all duration-200 ${
      isActive
        ? "text-[#7C3AED]"
        : "text-gray-500 group-hover:text-[#7C3AED]"
    }`;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      onClose();
      navigate("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile overlay only */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed left-0 top-0 z-[70]
          flex h-screen h-dvh w-[220px] flex-col
          border-r border-gray-200 bg-white

          transition-transform duration-300 ease-in-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* Logo — desktop design unchanged */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <img
            src="/web_logo.png"
            alt="GlobalScion"
            className="h-9 w-auto object-contain"
          />

          {/* Close button: mobile only */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#7C3AED] lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation — existing menu items and routes unchanged */}
        <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-2">
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            end
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          {/* Conferences */}
          <NavLink
            to="/admin/conferences"
            end
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <CalendarDays
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Conferences</span>
              </>
            )}
          </NavLink>

          {/* Brochures */}
          <NavLink
            to="/admin/brochures"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <FilePlus
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Brochures</span>
              </>
            )}
          </NavLink>

          {/* Download Brochures */}
          <NavLink
            to="/admin/download-brochures"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <Download
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Download Brochures</span>
              </>
            )}
          </NavLink>

          {/* Abstracts */}
          <NavLink
            to="/admin/abstracts"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <FileText
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Abstracts</span>
              </>
            )}
          </NavLink>

          {/* Employees */}
          <NavLink
            to="/admin/employees"
            end
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <UserCircle
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Employees</span>
              </>
            )}
          </NavLink>

          {/* Employee Attendance */}
          <NavLink
            to="/admin/employee-attendance"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <CalendarCheck
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Employee Attendance</span>
              </>
            )}
          </NavLink>

          {/* Registrations */}
          <NavLink
            to="/admin/registrations"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <ClipboardList
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Registrations</span>
              </>
            )}
          </NavLink>

          {/* Payments */}
          <NavLink
            to="/admin/payments"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <CreditCard
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Payments</span>
              </>
            )}
          </NavLink>

          {/* Invoices */}
          <NavLink
            to="/admin/invoices"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <Receipt
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Invoices</span>
              </>
            )}
          </NavLink>

          {/* Reports */}
          <NavLink
            to="/admin/reports"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <BarChart3
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Reports</span>
              </>
            )}
          </NavLink>

          {/* Speakers */}
          <NavLink
            to="/admin/speakers"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <Mic2
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Speakers</span>
              </>
            )}
          </NavLink>

          {/* Reviews */}
          <NavLink
            to="/admin/reviews"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <Star
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Reviews</span>
              </>
            )}
          </NavLink>

          {/* Subscribers */}
          <NavLink
            to="/admin/subscribers"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <Users
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Subscribers</span>
              </>
            )}
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/admin/profile"
            onClick={onClose}
            className={navClass}
          >
            {({ isActive }) => (
              <>
                <UserCircle
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={iconClass({ isActive })}
                />
                <span>Profile</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Logout — same action and styling */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-2">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut
              size={17}
              className="shrink-0 text-gray-500 transition group-hover:text-red-500"
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;