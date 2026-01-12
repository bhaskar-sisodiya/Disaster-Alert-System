import "./../styles/navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile"); // ✅ important
    navigate("/");
    window.location.reload(); // ✅ ensures navbar updates instantly
  };

  return (
    <nav className="navbar">
      <span className="logo" onClick={() => navigate("/")}>
        🌍 Disaster Alert
      </span>

      <div className="nav-actions">
        {!token ? (
          <>
            <button className="btn secondary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn primary" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        ) : (
          <>
            {/* ✅ show username */}
            {profile?.username && (
              <span className="nav-user">
                Hi, <b>{profile.username}</b>
                {profile?.isAdmin && <span className="admin-badge">ADMIN</span>}
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
