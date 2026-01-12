import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const profile = JSON.parse(localStorage.getItem("profile")); // optional method
  // BUT better: directly check from token? We cannot.
  // So we'll do a safe fallback:
  const isAdmin = profile?.isAdmin;

  return isAdmin ? children : <Navigate to="/" replace />;
}
