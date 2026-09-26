import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later Firebase / backend authentication will be added here.

    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f7f7fc]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT ================= */}

        <div
          className="relative hidden overflow-hidden bg-[#120b3f] bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "url('/admin-login-bg.png')",
          }}
        >

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090524]/90 via-[#17104f]/30 to-[#17104f]/20" />


          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <div>

              <img
                src="/web_logo.png"
                alt="GlobalScion"
                className="h-14 w-auto"
              />

            </div>


            {/* Content */}
            <div className="max-w-xl">

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">
                Conference Management
              </p>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">

                Manage Conferences

                <span className="block bg-gradient-to-r from-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                  Build a Better Tomorrow
                </span>

              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                Manage conferences, registrations, speakers,
                employees and payments from one powerful
                administration platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-xl font-bold text-white">
                    50+
                  </p>
                  <p className="text-xs text-white/60">
                    Conferences
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-xl font-bold text-white">
                    10K+
                  </p>
                  <p className="text-xs text-white/60">
                    Attendees
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-xl font-bold text-white">
                    50+
                  </p>
                  <p className="text-xs text-white/60">
                    Countries
                  </p>
                </div>

              </div>

            </div>


            <div className="text-sm text-white/50">
              © 2026 GlobalScion Conference Management
            </div>

          </div>

        </div>


        {/* ================= RIGHT ================= */}

        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">

          <div className="w-full max-w-[500px]">

            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">

              <img
                src="/images/web_logo.png"
                alt="GlobalScion"
                className="h-14"
              />

            </div>


            {/* Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_25px_70px_rgba(64,40,120,0.10)] sm:p-10">

              <div className="text-center">

                <h2 className="text-3xl font-bold text-[#15123d]">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Sign in to your admin account to continue
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >

                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}

                    </button>

                  </div>

                </div>


                {/* Options */}
                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-2">

                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-600 text-white">
                      <Check size={13} />
                    </span>

                    <span className="text-sm text-gray-600">
                      Remember me
                    </span>

                  </label>


                  <button
                    type="button"
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    Forgot password?
                  </button>

                </div>


                {/* Login */}
                <button
                  type="submit"
                  className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#6935d5] to-[#7c3aed] text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.01] hover:shadow-purple-500/30"
                >

                  Login

                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;