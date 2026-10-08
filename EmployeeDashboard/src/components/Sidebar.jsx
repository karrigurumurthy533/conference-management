import {
  Bell,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
  UserRound,
  BookOpen,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  employeeLogoutApi,
} from "../api/employeeApis";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Conference",
    path: "/conference",
    icon: CalendarDays,
  },
  {
    name: "Speakers",
    path: "/speakers",
    icon: UserRound,
  },
  {
    name: "Abstracts",
    path: "/abstracts",
    icon: FileText,
  },
  {
    name: "Brochures",
    path: "/brochures",
    icon: BookOpen,
  },
  {
    name: "Registrations",
    path: "/registrations",
    icon: Users,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: CheckSquare,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

function Sidebar({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await employeeLogoutApi();
    } catch (error) {
      console.error(
        "Employee logout API failed:",
        error
      );
    } finally {
      localStorage.removeItem(
        "employeeToken"
      );

      localStorage.removeItem(
        "employeeUser"
      );

      // Backward compatibility
      localStorage.removeItem(
        "isLoggedIn"
      );

      localStorage.removeItem(
        "userRole"
      );

      localStorage.removeItem(
        "userEmail"
      );

      navigate("/login", {
        replace: true,
      });
    }
  };

  // ======================================================
  // NAV LINK CLASS
  // ======================================================

  const navClass = ({ isActive }) =>
    `group flex h-[40px] items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#8138A2] text-white"
        : "text-gray-600 hover:bg-purple-50 hover:text-[#8138A2]"
    }`;

  // ======================================================
  // MOBILE NAVIGATION CLICK
  // ======================================================

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <>
      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[55]
            bg-black/30
            lg:hidden
          "
        />
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[60]
          flex
          h-screen
          w-[220px]
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <div
          className="
            flex
            h-[70px]
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
          "
        >
          <img
            src="/web_logo.png"
            alt="GlobalScion"
            className="
              h-9
              w-auto
              object-contain
            "
          />

          {/* =================================================
              MOBILE CLOSE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-purple-50
              hover:text-[#8138A2]
              lg:hidden
            "
            aria-label="Close menu"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-hidden
            px-3
            py-2
          "
        >
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  className={navClass}
                >
                  {({ isActive }) => (
                    <>
                      {/* =================================================
                          ICON
                      ================================================== */}

                      <Icon
                        size={18}
                        strokeWidth={
                          isActive
                            ? 2.4
                            : 2
                        }
                        className={`
                          shrink-0
                          transition-colors
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-[#8138A2]"
                          }
                        `}
                      />

                      {/* =================================================
                          MENU NAME
                      ================================================== */}

                      <span className="truncate">
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-gray-100
            px-3
            py-2
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex
              h-[40px]
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-2.5
              text-[13px]
              font-medium
              text-gray-600
              transition-all
              duration-200
              hover:bg-red-50
              hover:text-red-500
            "
          >
            <LogOut
              size={18}
              strokeWidth={2}
              className="
                shrink-0
                text-gray-500
                transition-colors
                group-hover:text-red-500
              "
            />

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;