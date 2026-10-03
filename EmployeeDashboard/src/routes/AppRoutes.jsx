
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import MyConference from "../Pages/MyConference";
import Speakers from "../Pages/Speakers";
import Abstracts from "../Pages/Abstracts";
import Registrations from "../Pages/Registrations";
import Notifications from "../Pages/Notifications";
import Profile from "../Pages/Profile";
import MainLayout from "../layouts/MainLayout";
import Attendance from "../Pages/Attendance";
import Brochures from "../Pages/Brochures";

// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("employeeToken");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// ======================================================
// APP ROUTES
// ======================================================

function AppRoutes() {
  return (
    <Routes>

      {/* ==================================================
          ROOT
      ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* ==================================================
          LOGIN
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ==================================================
          PROTECTED EMPLOYEE ROUTES
      ================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* My Conference */}
        <Route
          path="/conference"
          element={<MyConference />}
        />

        {/* Speakers */}
        <Route
          path="/speakers"
          element={<Speakers />}
        />

        {/* Abstracts */}
        <Route
          path="/abstracts"
          element={<Abstracts />}
        />

        {/* Registrations */}
        <Route
          path="/registrations"
          element={<Registrations />}
        />

        {/* Brochures */}
        <Route
          path="/brochures"
          element={<Brochures />}
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={<Attendance />}
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      {/* ==================================================
          404
      ================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;
