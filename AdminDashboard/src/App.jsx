import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Toaster from "./components/admin/Toaster";

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
import BrochureManagement from "./pages/admin/brochuers";
import UploadBrochure from "./pages/admin/UploadBrochure";
import AdminReviews from "./pages/admin/AdminReviews";
import AddReview from "./pages/admin/AddReview";
import Invoices from "./pages/admin/Invoices";
import Abstracts from "./pages/admin/Abstracts";
import DownloadBrochures from "./pages/admin/DownloadBrochures";
import BrochureDetails from "./pages/admin/BrochureDetails";
import UserDownloadBrochureDetails from "./pages/admin/UserDownloadBrochureDetails";
import AbstractDetails from "./pages/admin/AbstractDetails";
import Subscribers from "./pages/admin/Subscribers";
import SubscribersDetails from "./pages/admin/SubscribersDetails";
import CreateInvoice from "./pages/admin/createInvoice";
import InvoiceDetails from "./pages/admin/InvoiceDetails";
import EmployeeAttendance from "./pages/admin/EmployeeAttendance";

function App() {
  return (
    <>
      {/* Global Toast Notifications */}
      <Toaster />

      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Conferences */}
          <Route
            path="conferences/create"
            element={<CreateConference />}
          />
          <Route
            path="conferences/create/:id"
            element={<CreateConference />}
          />
          <Route path="conferences" element={<AllConferences />} />
          <Route
            path="conferences/:id"
            element={<ConferenceDetails />}
          />

          {/* Employees */}
          <Route path="employees" element={<Employees />} />
          <Route
            path="employees/create"
            element={<CreateEmployee />}
          />
          <Route
            path="employees/:employeeId"
            element={<EmployeeDetailsPage />}
          />
          <Route
            path="employee-attendance"
            element={<EmployeeAttendance />}
          />

          {/* Registrations */}
          <Route path="registrations" element={<Registrations />} />
          <Route
            path="registrations/:registrationId"
            element={<RegistrationDetailsPage />}
          />
          <Route
            path="registrations/:registrationId/user/:userId"
            element={<RegistrationUserDetailsPage />}
          />

          {/* Payments and Reports */}
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />

          {/* Speakers */}
          <Route path="speakers" element={<Speakers />} />
          <Route
            path="speakers/:id"
            element={<SpeakersDetailsPage />}
          />
          <Route path="speakers/add" element={<AddSpeakersPage />} />
          <Route
            path="speakers/add/:id"
            element={<AddSpeakersPage />}
          />

          {/* Brochures */}
          <Route path="brochures" element={<BrochureManagement />} />
          <Route
            path="brochures/:id"
            element={<BrochureDetails />}
          />
          <Route
            path="brochures/upload"
            element={<UploadBrochure />}
          />
          <Route
            path="download-brochures"
            element={<DownloadBrochures />}
          />
          <Route
            path="download-brochures/:id/details"
            element={<UserDownloadBrochureDetails />}
          />

          {/* Invoices */}
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route
            path="invoices/:invoiceId"
            element={<InvoiceDetails />}
          />

          {/* Abstracts */}
          <Route path="abstracts" element={<Abstracts />} />
          <Route
            path="abstracts/:id"
            element={<AbstractDetails />}
          />

          {/* Reviews */}
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reviews/add" element={<AddReview />} />
          <Route path="reviews/add/:id" element={<AddReview />} />

          {/* Subscribers */}
          <Route path="subscribers" element={<Subscribers />} />
          <Route
            path="subscribers/:id"
            element={<SubscribersDetails />}
          />

          {/* Notifications and Profile */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Default Route */}
        <Route
          path="*"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </>
  );
}

export default App;