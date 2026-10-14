
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
import ChangePassword from "../Pages/ChangePassword";

// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("employeeToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ======================================================
// PUBLIC ROUTE - LOGIN PAGE
// ======================================================

function PublicRoute({ children }) {
  const token = localStorage.getItem("employeeToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ======================================================
// APP ROUTES
// ======================================================

function AppRoutes() {
  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* LOGIN - OUTSIDE MAIN LAYOUT */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* CHANGE PASSWORD - OUTSIDE MAIN LAYOUT / OUTLET */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* PROTECTED EMPLOYEE ROUTES - INSIDE MAIN LAYOUT / OUTLET */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conference" element={<MyConference />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/abstracts" element={<Abstracts />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/brochures" element={<Brochures />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
