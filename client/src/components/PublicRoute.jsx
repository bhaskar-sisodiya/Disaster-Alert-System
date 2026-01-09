import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ Allow logged-in users to stay on landing page
  if (token && location.pathname === "/") {
    return children;
  }

  // ❌ Block login & register when logged in
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
