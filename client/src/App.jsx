import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateAlert from "./components/CreateAlert";
import ViewAlerts from "./components/ViewAlerts";
import EmergencyCategories from "./components/EmergencyCategories";
import EmergencyNumbers from "./components/EmergencyNumbers";
import Profile from "./components/Profile";
import AlertHistory from "./components/AlertHistory";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      {/* 🔝 Always visible */}
      <Navbar />

      {/* 🔄 Page content */}
      <Routes>
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
              <CreateAlert />
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
