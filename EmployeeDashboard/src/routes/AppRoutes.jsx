import { Navigate, Route, Routes } from "react-router-dom";



import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import MyConference from "../Pages/MyConference";
import Speakers from "../Pages/Speakers";
import Abstracts from "../Pages/Abstracts";
import Registrations from "../Pages/Registrations";
import Tasks from "../Pages/Tasks";
import FollowUps from "../Pages/FollowUps";
import Communications from "../Pages/Communications";
import Notifications from "../Pages/Notifications";
import Profile from "../Pages/Profile";
import MainLayout from "../layouts/mainLayout";

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/conference"
          element={<MyConference />}
        />

        <Route
          path="/speakers"
          element={<Speakers />}
        />

        <Route
          path="/abstracts"
          element={<Abstracts />}
        />

        <Route
          path="/registrations"
          element={<Registrations />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/follow-ups"
          element={<FollowUps />}
        />

        <Route
          path="/communications"
          element={<Communications />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

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