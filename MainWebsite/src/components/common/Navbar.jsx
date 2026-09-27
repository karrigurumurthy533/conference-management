
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  // =========================================================
  // CHECK ACTIVE ROUTE
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  // =========================================================

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // =========================================================
  // THEME STYLES
  // =========================================================

  const navbarStyle = {
    backgroundColor: "var(--bg-card)",
    borderColor: "var(--border)",
  };

  const navTextStyle = {
    color: "var(--text-secondary)",
  };

  // =========================================================
  // LOGO
  // =========================================================

  const logoSrc = "/images/dark_logo.png";

  // =========================================================
  // DESKTOP LINK CLASS
  // =========================================================

  const desktopLinkClass = (path) => `
    relative
    text-sm
    transition-all
    duration-300
    hover:opacity-75
    ${
      isActive(path)
        ? "font-semibold"
        : "font-medium"
    }
  `;

  // =========================================================
  // MOBILE LINK CLASS
  // =========================================================

  const mobileLinkClass = (path) => `
    flex
    items-center
    justify-between
    rounded-lg
    px-4
    py-3
    text-sm
    transition-all
    duration-300
    ${
      isActive(path)
        ? "font-semibold"
        : "font-medium"
    }
  `;

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          backdrop-blur-xl
          transition-all
          duration-500
        "
        style={navbarStyle}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-6">

          {/* =================================================
              LOGO
          ================================================== */}

          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center"
            >
              <img
                src={logoSrc}
                alt="GlobalScion Conferences"
                className="
                  h-11
                  w-auto
                  object-contain
                  transition-all
                  duration-500
                  sm:h-12
                "
              />
            </Link>
          </div>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="
              hidden
              flex-1
              items-center
              justify-center
              gap-7
              md:flex
              lg:gap-8
            "
          >

            {/* HOME */}

            <Link
              to="/"
              className={desktopLinkClass("/")}
              style={{
                color: isActive("/")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Home

              {isActive("/") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              className={desktopLinkClass("/about")}
              style={{
                color: isActive("/about")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              About

              {isActive("/about") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* CONFERENCES */}

            <Link
              to="/conferences"
              className={desktopLinkClass("/conferences")}
              style={{
                color: isActive("/conferences")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Conferences

              {isActive("/conferences") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* SPEAKERS */}

            <Link
              to="/speakers"
              className={desktopLinkClass("/speakers")}
              style={{
                color: isActive("/speakers")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Speakers

              {isActive("/speakers") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* REVIEWS */}

            <Link
              to="/reviews"
              className={desktopLinkClass("/reviews")}
              style={{
                color: isActive("/reviews")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Reviews

              {isActive("/reviews") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* TERMS */}

            <Link
              to="/terms"
              className={desktopLinkClass("/terms")}
              style={{
                color: isActive("/terms")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Terms & Conditions

              {isActive("/terms") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* PRIVACY */}

            <Link
              to="/privacy"
              className={desktopLinkClass("/privacy")}
              style={{
                color: isActive("/privacy")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Global Privacy Policy

              {isActive("/privacy") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

            {/* CONTACT */}

            <Link
              to="/contact"
              className={desktopLinkClass("/contact")}
              style={{
                color: isActive("/contact")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              }}
            >
              Contact

              {isActive("/contact") && (
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    right-0
                    mx-auto
                    h-[2px]
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--brand)",
                  }}
                />
              )}
            </Link>

          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="ml-auto flex items-center gap-2">

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((prev) => !prev)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileMenuOpen}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                transition-all
                duration-300
                hover:scale-105
                active:scale-95
                md:hidden
              "
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--brand)",
              }}
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        <div
          className={`
            overflow-hidden
            border-t
            transition-all
            duration-500
            md:hidden
            ${
              mobileMenuOpen
                ? "max-h-[600px] opacity-100"
                : "max-h-0 border-transparent opacity-0"
            }
          `}
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <nav
            className="
              mx-auto
              max-w-7xl
              px-5
              py-4
              sm:px-6
            "
          >

            {/* HOME */}

            <Link
              to="/"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/")}
              style={{
                color: isActive("/")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Home</span>
              <ChevronRight size={16} />
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/about")}
              style={{
                color: isActive("/about")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/about")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>About</span>
              <ChevronRight size={16} />
            </Link>

            {/* CONFERENCES */}

            <Link
              to="/conferences"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/conferences")}
              style={{
                color: isActive("/conferences")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/conferences")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Conferences</span>
              <ChevronRight size={16} />
            </Link>

            {/* SPEAKERS */}

            <Link
              to="/speakers"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/speakers")}
              style={{
                color: isActive("/speakers")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/speakers")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Speakers</span>
              <ChevronRight size={16} />
            </Link>

            {/* REVIEWS */}

            <Link
              to="/reviews"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/reviews")}
              style={{
                color: isActive("/reviews")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/reviews")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Reviews</span>
              <ChevronRight size={16} />
            </Link>

            {/* TERMS */}

            <Link
              to="/terms"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/terms")}
              style={{
                color: isActive("/terms")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/terms")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Terms & Conditions</span>
              <ChevronRight size={16} />
            </Link>

            {/* PRIVACY */}

            <Link
              to="/privacy"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/privacy")}
              style={{
                color: isActive("/privacy")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/privacy")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Global Privacy Policy</span>
              <ChevronRight size={16} />
            </Link>

            {/* CONTACT */}

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className={mobileLinkClass("/contact")}
              style={{
                color: isActive("/contact")
                  ? "var(--brand)"
                  : "var(--text-secondary)",
                backgroundColor: isActive("/contact")
                  ? "var(--bg-secondary)"
                  : "transparent",
              }}
            >
              <span>Contact</span>
              <ChevronRight size={16} />
            </Link>

          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
