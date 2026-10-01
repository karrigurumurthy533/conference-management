import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AddSpeakersPage from "./pages/admin/AddSpeakersPage";
import EmployeeDetailsPage from "./pages/admin/employees/EmployeeDetailsPage";
import RegistrationDetailsPage from "./pages/admin/RegistrationDetailsPage";
import RegistrationUserDetailsPage from "./pages/admin/RegistrationUserDetailsPage";

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
import Employees from "./pages/admin/employees/Employees";
import ConferenceDetails from "./pages/admin/conferences/ConferenceDetails";
import SpeakersDetailsPage from "./pages/admin/SpeakersDetailsPage";


function App() {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        {/* Conferences */}
        <Route path="conferences/create" element={<CreateConference />} />

        <Route path="conferences" element={<AllConferences />} />
        <Route path="conferences/:id" element={<ConferenceDetails />} />

        <Route path="/admin/employees" element={<Employees />} />
        <Route path="speakers/:id" element={<SpeakersDetailsPage />} />

        {/* Employees */}
        <Route path="employees/create" element={<CreateEmployee />} />

        <Route
          path="/admin/employees/:employeeId"
          element={<EmployeeDetailsPage />}
        />

        <Route path="/admin/registrations" element={<Registrations />} />

        <Route
          path="/admin/registrations/:registrationId"
          element={<RegistrationDetailsPage />}
        />

        <Route
          path="/admin/registrations/:registrationId/user/:userId"
          element={<RegistrationUserDetailsPage />}
        />

        <Route path="payments" element={<Payments />} />

        <Route path="reports" element={<Reports />} />

        <Route path="speakers" element={<Speakers />} />
      
        <Route path="/admin/speakers/add" element={<AddSpeakersPage />} />

        <Route path="notifications" element={<Notifications />} />

        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;
