import React, { useState } from "react";
import {
  Globe2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "employee");
    localStorage.setItem("userEmail", email);

    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[430px]">

        {/* Logo + Brand */}
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

        {/* Login Card */}
        <div className="w-full bg-white border border-[#dedfea] rounded-2xl shadow-sm px-6 py-9">

          <form onSubmit={handleLogin}>

            {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@globalscion.com"
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
                  "
                  required
                />

              </div>
            </div>

            {/* Password */}
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7a8197]
                    hover:text-[#6846e8]
                    transition
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

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-7">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="
                    w-3.5
                    h-3.5
                    rounded
                    border-[#cfd3df]
                    text-[#6846e8]
                    focus:ring-[#6846e8]
                  "
                />

                <span className="text-[12px] text-[#59617a]">
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="
                  text-[12px]
                  font-semibold
                  text-[#6846e8]
                  hover:text-[#5636d4]
                  transition
                "
              >
                Forgot password?
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-[12px] text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
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
              "
            >
              Sign in
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;