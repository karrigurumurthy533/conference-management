import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              className="
                text-sm
                font-semibold
                transition-all
                duration-300
                hover:opacity-75
              "
              style={{
                color: "var(--brand)",
              }}
            >
              Home
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              About
            </Link>

            {/* CONFERENCES */}

            <Link
              to="/conferences"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Conferences
            </Link>

            {/* SPEAKERS */}

            <Link
              to="/speakers"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Speakers
            </Link>

            {/* REVIEWS */}

            <Link
              to="/reviews"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Reviews
            </Link>

            {/* TERMS AND CONDITIONS */}

            <Link
              to="/terms"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Terms & Conditions
            </Link>

            {/* GLOBAL PRIVACY POLICY */}

            <Link
              to="/privacy"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Global Privacy Policy
            </Link>

            {/* CONTACT */}

            <Link
              to="/contact"
              className="
                text-sm
                font-medium
                transition-all
                duration-300
                hover:opacity-75
              "
              style={navTextStyle}
            >
              Contact
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
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-semibold
                transition-all
                duration-300
              "
              style={{
                color: "var(--brand)",
              }}
            >
              <span>Home</span>

              <ChevronRight size={16} />
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>About</span>

              <ChevronRight size={16} />
            </Link>

            {/* CONFERENCES */}

            <Link
              to="/conferences"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>Conferences</span>

              <ChevronRight size={16} />
            </Link>

            {/* SPEAKERS */}

            <Link
              to="/speakers"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>Speakers</span>

              <ChevronRight size={16} />
            </Link>

            {/* REVIEWS */}

            <Link
              to="/reviews"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>Reviews</span>

              <ChevronRight size={16} />
            </Link>

            {/* TERMS AND CONDITIONS */}

            <Link
              to="/terms"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>Terms & Conditions</span>

              <ChevronRight size={16} />
            </Link>

            {/* GLOBAL PRIVACY POLICY */}

            <Link
              to="/privacy"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
            >
              <span>Global Privacy Policy</span>

              <ChevronRight size={16} />
            </Link>

            {/* CONTACT */}

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
              "
              style={navTextStyle}
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