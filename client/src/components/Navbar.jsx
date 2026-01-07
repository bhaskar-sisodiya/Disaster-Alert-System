import "./../styles/navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
