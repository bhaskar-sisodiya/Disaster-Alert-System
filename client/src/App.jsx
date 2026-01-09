import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateAlert from "./components/CreateAlert";
import ViewAlerts from "./components/ViewAlerts";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      <Navbar />

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

        {/* PROTECTED ALERT ROUTES */}
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
      </Routes>
    </>
  );
}

export default App;
