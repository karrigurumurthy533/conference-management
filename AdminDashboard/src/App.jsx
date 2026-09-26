import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";

import CreateConference from "./pages/admin/conferences/CreateConference";
import AllConferences from "./pages/admin/conferences/AllConferences";

import CreateEmployee from "./pages/admin/employees/CreateEmployee";

import Registrations from "./pages/admin/Registrations";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";
import Speakers from "./pages/admin/Speakers";
import Notifications from "./pages/admin/Notifications";
import Profile from "./pages/admin/Profile";

function App() {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />


      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<AdminLayout />}>

        {/* Dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />


        {/* Conferences */}
        <Route
          path="conferences/create"
          element={<CreateConference />}
        />

        <Route
          path="conferences"
          element={<AllConferences />}
        />


        {/* Employees */}
        <Route
          path="employees/create"
          element={<CreateEmployee />}
        />


        {/* Other Pages */}
        <Route
          path="registrations"
          element={<Registrations />}
        />

        <Route
          path="payments"
          element={<Payments />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="speakers"
          element={<Speakers />}
        />

        <Route
          path="notifications"
          element={<Notifications />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

      </Route>


      {/* Default */}
      <Route
        path="*"
        element={<Navigate to="/admin/login" replace />}
      />

    </Routes>
  );
}

export default App;