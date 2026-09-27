
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

    navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7fc] px-5 py-10 sm:px-10">

      <div className="w-full max-w-[500px]">

        {/* Login Card */}

        <div className="rounded-3xl border border-gray-100 bg-white px-7 py-11 shadow-[0_25px_70px_rgba(64,40,120,0.10)] sm:px-10 sm:py-12">

          {/* Logo */}

          <div className="mb-5 flex justify-center">
            <img
              src="/web_logo.png"
              alt="GlobalScion"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Heading */}

          <div className="text-center">

            <h2 className="text-2xl font-bold text-[#15123d]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your admin account to continue
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-9 space-y-5"
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
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* Login Button */}

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

          {/* Footer */}

          <p className="mt-8 text-center text-xs text-gray-400">
            © 2026 GlobalScion Conference Management
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
