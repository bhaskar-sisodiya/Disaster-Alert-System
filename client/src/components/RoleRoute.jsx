// components/RoleRoute.jsx
import { Navigate } from "react-router-dom";

export default function RoleRoute({ allowedRoles = [], children }) {
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  if (!profile?.role) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(profile.role) ? children : <Navigate to="/" replace />;
}
