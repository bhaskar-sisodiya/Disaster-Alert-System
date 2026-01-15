import "./../styles/navbar.css";
import { useNavigate } from "react-router-dom";
import WeatherBadge from "./WeatherBadge";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <span className="logo" onClick={() => navigate("/")}>
        🌍 Disaster Alert
      </span>

      <div className="nav-actions">
        {!token ? (
          <>
            <button
              className="btn secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn primary"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            {/* ✅ Weather badge */}
            <WeatherBadge />

            {/* ✅ show username */}
            {profile?.username && (
              <span className="nav-user">
                Hi, <b>{profile.username}</b>
                {/* ✅ role badge */}
                {profile?.role && (
                  <span className="admin-badge">
                    {profile.role.toUpperCase()}
                  </span>
                )}
              </span>
            )}

            <button className="btn danger" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
