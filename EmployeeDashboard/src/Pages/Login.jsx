
import React, { useEffect, useState } from "react";
import {
  Globe2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  employeeLogin,
  clearEmployeeError,
  selectEmployeeLoading,
  selectEmployeeError,
} from "../redux/employeeSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectEmployeeLoading);
  const reduxError = useSelector(selectEmployeeError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD REMEMBERED EMAIL
  // ======================================================

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(
      "rememberEmployeeEmail"
    );

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // ======================================================
  // REDUX ERROR
  // ======================================================

  useEffect(() => {
    if (!reduxError) {
      return;
    }

    if (typeof reduxError === "string") {
      setError(reduxError);
      return;
    }

    setError(
      reduxError?.message ||
        reduxError?.error ||
        "Employee login failed"
    );
  }, [reduxError]);

  // ======================================================
  // EMAIL CHANGE
  // ======================================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }

    if (reduxError) {
      dispatch(clearEmployeeError());
    }
  };

  // ======================================================
  // PASSWORD CHANGE
  // ======================================================

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error) {
      setError("");
    }

    if (reduxError) {
      dispatch(clearEmployeeError());
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    dispatch(clearEmployeeError());

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // ====================================================
    // VALIDATION
    // ====================================================

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ====================================================
    // API LOGIN
    // ====================================================

    try {
      const result = await dispatch(
        employeeLogin({
          email: trimmedEmail,
          password: trimmedPassword,
        })
      ).unwrap();


      if (!result?.success) {
        setError(
          result?.message ||
            "Employee login failed"
        );

        return;
      }


      if (!result?.token) {
        setError(
          "Login successful, but authentication token was not received."
        );

        return;
      }


      if (!result?.user) {
        setError(
          "Login successful, but employee information was not received."
        );

        return;
      }

  
      const role = result.user.role
        ?.toString()
        .toLowerCase();

      if (role !== "employee") {
        setError(
          "You are not authorized as an employee."
        );

        return;
      }

      // ==================================================
      // SAVE TOKEN
      // ==================================================

      localStorage.setItem(
        "employeeToken",
        result.token
      );

      // ==================================================
      // SAVE USER
      // ==================================================

      localStorage.setItem(
        "employeeUser",
        JSON.stringify(result.user)
      );

      // ==================================================
      // OPTIONAL BACKWARD COMPATIBILITY
      // ==================================================

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // ==================================================
      // REMEMBER EMAIL
      // ==================================================

      if (rememberMe) {
        localStorage.setItem(
          "rememberEmployeeEmail",
          trimmedEmail
        );
      } else {
        localStorage.removeItem(
          "rememberEmployeeEmail"
        );
      }

      // ==================================================
      // VERIFY TOKEN WAS SAVED
      // ==================================================

      const savedToken =
        localStorage.getItem(
          "employeeToken"
        );

      if (!savedToken) {
        setError(
          "Unable to save login session."
        );

        return;
      }

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "===================================="
      );

      console.error(
        "EMPLOYEE LOGIN ERROR:",
        err
      );

      console.error(
        "===================================="
      );

      let errorMessage =
        "Employee login failed.";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.data?.message) {
        errorMessage =
          err.data.message;
      }

      setError(errorMessage);
    }
  };

  // ======================================================
  // LOGOUT HELPER
  // ======================================================

  // Use the same keys from this login flow when logging out:
  //
  // localStorage.removeItem("employeeToken");
  // localStorage.removeItem("employeeUser");
  // localStorage.removeItem("isLoggedIn");

  return (
    <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[430px]">

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="flex items-center justify-center gap-3 mb-7">

          <div className="w-11 h-11 rounded-xl bg-[#6846e8] flex items-center justify-center shadow-sm shrink-0">

            <Globe2
              size={23}
              strokeWidth={2}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-[22px] font-bold text-[#111827] leading-tight tracking-tight">
              GlobalScion
            </h1>

            <p className="text-[12px] text-[#68708a] mt-0.5">
              Conference Management Platform
            </p>

          </div>

        </div>

        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <div className="w-full bg-white border border-[#dedfea] rounded-2xl shadow-sm px-6 py-9">

          <form onSubmit={handleLogin}>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="mb-6">

              <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8197]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@globalscion.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="
                    w-full
                    h-[38px]
                    rounded-lg
                    border
                    border-[#d9dce8]
                    bg-white
                    pl-9
                    pr-3
                    text-[13px]
                    text-[#111827]
                    outline-none
                    transition
                    focus:border-[#6846e8]
                    focus:ring-2
                    focus:ring-[#6846e8]/10
                    placeholder:text-[#9298aa]
                    disabled:bg-gray-50
                    disabled:cursor-not-allowed
                  "
                />

              </div>

            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div className="mb-5">

              <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={16}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8197]"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="
                    w-full
                    h-[38px]
                    rounded-lg
                    border
                    border-[#d9dce8]
                    bg-white
                    pl-9
                    pr-10
                    text-[13px]
                    text-[#111827]
                    outline-none
                    transition
                    focus:border-[#6846e8]
                    focus:ring-2
                    focus:ring-[#6846e8]/10
                    placeholder:text-[#9298aa]
                    disabled:bg-gray-50
                    disabled:cursor-not-allowed
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7a8197]
                    hover:text-[#6846e8]
                    transition
                    disabled:cursor-not-allowed
                  "
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            {/* ==================================================
                REMEMBER / FORGOT
            ================================================== */}

            <div className="flex items-center justify-between mb-7">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading}
                  className="
                    w-3.5
                    h-3.5
                    rounded
                    border-[#cfd3df]
                    text-[#6846e8]
                    focus:ring-[#6846e8]
                    disabled:cursor-not-allowed
                  "
                />

                <span className="text-[12px] text-[#59617a]">
                  Remember me
                </span>

              </label>

              <button
                type="button"
                disabled={loading}
                className="
                  text-[12px]
                  font-semibold
                  text-[#6846e8]
                  hover:text-[#5636d4]
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Forgot password?
              </button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2">

                <p className="text-[12px] text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* ==================================================
                SIGN IN
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-[39px]
                rounded-lg
                bg-[#6846e8]
                text-white
                text-[13px]
                font-semibold
                hover:bg-[#5b3bd4]
                active:scale-[0.99]
                transition-all
                shadow-sm
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
