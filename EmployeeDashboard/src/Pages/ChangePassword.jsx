
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";

import {
  changeEmployeePassword,
  selectChangePasswordLoading,
  selectChangePasswordError,
  selectChangePasswordSuccess,
  selectChangePasswordMessage,
  clearChangePasswordState,
} from "../redux/employeeSlice";

function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectChangePasswordLoading);
  const reduxError = useSelector(selectChangePasswordError);
  const reduxSuccess = useSelector(selectChangePasswordSuccess);
  const reduxMessage = useSelector(selectChangePasswordMessage);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");

    if (reduxError || reduxSuccess) {
      dispatch(clearChangePasswordState());
    }
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    dispatch(clearChangePasswordState());

    if (form.newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const token = sessionStorage.getItem("employeeToken");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      const result = await dispatch(
        changeEmployeePassword({
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        })
      ).unwrap();

      setSuccess(
        result?.message ||
          "Password changed successfully. Redirecting to login..."
      );

      // Clear authentication and employee data.
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");
      localStorage.removeItem("employee");

      sessionStorage.removeItem("employeeToken");
      sessionStorage.removeItem("employeeUser");
      sessionStorage.removeItem("employee");

      // User must log in with the new password.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : reduxError ||
              err?.message ||
              "Unable to change password. Please try again."
      );
    }
  };

  const passwordFields = [
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter new password",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-lg">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#8138A2] transition hover:bg-[#f3e8ff]"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        {/* PASSWORD CARD */}
        <div className="rounded-2xl border border-[#e2e0e9] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">

          {/* ICON */}
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e8ff] text-[#8138A2]">
            <LockKeyhole size={27} />
          </div>

          {/* HEADING */}
          <h1 className="text-2xl font-bold text-[#111827]">
            Change Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            Create a new password to keep your account secure.
          </p>

          {/* ERROR MESSAGE */}
          {(error || reduxError) && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error || reduxError}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {(success || (reduxSuccess && reduxMessage)) && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success || reduxMessage}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {passwordFields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-semibold text-[#374151]"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={
                      showPasswords[field.name] ? "text" : "password"
                    }
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading || Boolean(success)}
                    className="h-12 w-full rounded-xl border border-[#d9dce5] bg-white px-4 pr-12 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8138A2] focus:ring-4 focus:ring-[#8138A2]/10 disabled:bg-gray-50"
                  />

                  {/* SHOW / HIDE PASSWORD */}
                  <button
                    type="button"
                    onClick={() => togglePassword(field.name)}
                    aria-label={
                      showPasswords[field.name]
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] transition hover:text-[#8138A2]"
                  >
                    {showPasswords[field.name] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* PASSWORD HINT */}
            <p className="text-xs text-[#64748b]">
              Password must contain at least 8 characters.
            </p>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || Boolean(success) || reduxSuccess}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#8138A2] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d278c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating Password..."
                : success || reduxSuccess
                  ? "Password Updated"
                  : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
