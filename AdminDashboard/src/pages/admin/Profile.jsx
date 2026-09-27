import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Clock3,
  Pencil,
  Save,
  X,
  Lock,
  KeyRound,
  CheckCircle2,
  BriefcaseBusiness,
  Globe2,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@globalscion.com",
    phone: "+91 98765 43210",
    role: "Super Admin",
    department: "Administration",
    location: "Hyderabad, India",
    timezone: "IST (UTC +5:30)",
    bio: "Administrator managing conferences, registrations, speakers and platform activities.",
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-w-0 space-y-3">
      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Banner */}

        <div className="relative h-24 bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[20px] border-white" />

            <div className="absolute -bottom-20 left-1/3 h-36 w-36 rounded-full border-[18px] border-white" />
          </div>
        </div>

        {/* Profile Info */}

        <div className="relative px-4 pb-3">
          <div className="-mt-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3">
              {/* Avatar */}

              <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-xl border-4 border-white bg-violet-100 text-[20px] font-bold text-violet-700 shadow-sm">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>

              <div className="pb-1">
                <h2 className="text-[17px] font-bold leading-tight text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <BriefcaseBusiness
                    size={13}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] font-medium text-gray-500">
                    {profile.role}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="text-[12px] text-gray-500">
                    {profile.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={14} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {/* =================================================
            PERSONAL INFORMATION
        ================================================== */}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">
                Personal Information
              </h3>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Manage your basic account information.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <User size={17} className="text-violet-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            {/* First Name */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                First Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleChange("firstName", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                />
              ) : (
                <div className="flex h-10 items-center rounded-lg bg-gray-50 px-3 text-[12px] text-gray-700">
                  {profile.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Last Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleChange("lastName", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                />
              ) : (
                <div className="flex h-10 items-center rounded-lg bg-gray-50 px-3 text-[12px] text-gray-700">
                  {profile.lastName}
                </div>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-lg bg-gray-50 pl-9 text-[12px] text-gray-700">
                    {profile.email}
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-lg bg-gray-50 pl-9 text-[12px] text-gray-700">
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Department */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Department
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    handleChange("department", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                />
              ) : (
                <div className="flex h-10 items-center rounded-lg bg-gray-50 px-3 text-[12px] text-gray-700">
                  {profile.department}
                </div>
              )}
            </div>

            {/* Location */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleChange("location", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-lg bg-gray-50 pl-9 text-[12px] text-gray-700">
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            {/* Timezone */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Timezone
              </label>

              <div className="relative">
                <Globe2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) =>
                      handleChange("timezone", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-lg bg-gray-50 pl-9 text-[12px] text-gray-700">
                    {profile.timezone}
                  </div>
                )}
              </div>
            </div>

            {/* Role */}

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                Account Role
              </label>

              <div className="flex h-10 items-center justify-between rounded-lg bg-gray-50 px-3">
                <span className="text-[12px] font-medium text-gray-700">
                  {profile.role}
                </span>

                <span className="rounded-md bg-violet-100 px-2 py-1 text-[9px] font-semibold text-violet-700">
                  Admin
                </span>
              </div>
            </div>

            {/* Bio */}

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-gray-500">
                About
              </label>

              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) =>
                    handleChange("bio", e.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-5 text-gray-600">
                  {profile.bio}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <div className="space-y-3">
          {/* Account Status */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">
                  Account Status
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Current account information.
                </p>
              </div>

              <ShieldCheck
                size={19}
                className="text-violet-600"
              />
            </div>

            <div className="mt-3 space-y-2">
              {/* Status */}

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] text-gray-600">
                    Account Status
                  </span>
                </div>

                <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                  Active
                </span>
              </div>

              {/* Verification */}

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] text-gray-600">
                    Verification
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-violet-600">
                  Verified
                </span>
              </div>

              {/* Member Since */}

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] text-gray-600">
                    Member Since
                  </span>
                </div>

                <span className="text-[11px] text-gray-500">
                  Jan 2025
                </span>
              </div>

              {/* Last Login */}

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] text-gray-600">
                    Last Login
                  </span>
                </div>

                <span className="text-[11px] text-gray-500">
                  Today, 09:42 PM
                </span>
              </div>
            </div>
          </div>

          {/* Security */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                <Lock size={17} className="text-violet-600" />
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">
                  Security
                </h3>

                <p className="text-[11px] text-gray-400">
                  Manage account security.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {/* Password */}

              <button
                type="button"
                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <div className="flex items-center gap-2">
                  <KeyRound
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] font-medium text-gray-700">
                    Change Password
                  </span>
                </div>

                <span className="text-[11px] font-medium text-violet-600">
                  Change
                </span>
              </button>

              {/* 2FA */}

              <button
                type="button"
                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={15}
                    className="text-violet-600"
                  />

                  <span className="text-[12px] font-medium text-gray-700">
                    Two-Factor Authentication
                  </span>
                </div>

                <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                  ON
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADMIN PERMISSIONS
      ====================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">
              Admin Permissions
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-400">
              Permissions assigned to your administrator account.
            </p>
          </div>

          <ShieldCheck
            size={19}
            className="text-violet-600"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Conferences",
            "Registrations",
            "Payments",
            "Speakers",
            "Reports",
            "Employees",
          ].map((permission) => (
            <div
              key={permission}
              className="flex items-center gap-2 rounded-lg bg-violet-50/60 px-3 py-2.5"
            >
              <CheckCircle2
                size={14}
                className="shrink-0 text-violet-600"
              />

              <span className="truncate text-[11px] font-medium text-violet-700">
                {permission}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;