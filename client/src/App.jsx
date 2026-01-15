// App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";

import AdminPanel from "./components/admin/AdminPanel";

import Login from "./components/Login";
import Register from "./components/Register";
import CreateAlert from "./components/CreateAlert";
import ViewAlerts from "./components/ViewAlerts";

import AnalyticsHome from "./components/analytics/AnalyticsHome";
import AnalyticsSummary from "./components/analytics/AnalyticsSummary";
import AlertsOverTime from "./components/analytics/AlertsOverTime";
import TypeDistribution from "./components/analytics/TypeDistribution";
import SeverityDistribution from "./components/analytics/SeverityDistribution";
import SeverityByType from "./components/analytics/SeverityByType";
import TopLocations from "./components/analytics/TopLocations";
import ConfidenceBuckets from "./components/analytics/ConfidenceBuckets";

import EmergencyCategories from "./components/EmergencyCategories";
import EmergencyNumbers from "./components/EmergencyNumbers";
import Profile from "./components/Profile";
import AlertHistory from "./components/AlertHistory";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleRoute from "./components/RoleRoute";
import { ROLES } from "./constants/roles";

import AlertsMap from "./components/AlertsMap";

function App() {
  return (
    <>
      {/* 🔝 Always visible */}
      <Navbar />

      {/* 🔄 Page content */}
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminPanel />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* PROTECTED */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts/create"
          element={
            <ProtectedRoute>
              <RoleRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR, ROLES.USER]}
              >
                <CreateAlert />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts/view"
          element={
            <ProtectedRoute>
              <ViewAlerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.DMA, ROLES.USER]}>
                <AnalyticsHome />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/summary"
          element={
            <ProtectedRoute>
              <AnalyticsSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/alerts-over-time"
          element={
            <ProtectedRoute>
              <AlertsOverTime />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/type-distribution"
          element={
            <ProtectedRoute>
              <TypeDistribution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/severity-distribution"
          element={
            <ProtectedRoute>
              <SeverityDistribution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/severity-by-type"
          element={
            <ProtectedRoute>
              <SeverityByType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/top-locations"
          element={
            <ProtectedRoute>
              <TopLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/confidence-buckets"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <ConfidenceBuckets />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts/history"
          element={
            <ProtectedRoute>
              <AlertHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <EmergencyCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency/:category"
          element={
            <ProtectedRoute>
              <EmergencyNumbers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts/map"
          element={
            <ProtectedRoute>
              <AlertsMap />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 🔻 Always visible */}
      <Footer />

      {/* ✅ Toast container globally */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
