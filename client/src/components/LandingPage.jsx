import "./../styles/landing.css";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (token) {
    return (
      <div className="landing dashboard">
        <div className="dashboard-container">
          <h1 className="dashboard-title">
            Welcome to Disaster Alert System
          </h1>

          <div className="dashboard-grid">
            <div
              className="dashboard-card"
              onClick={() => navigate("/profile")}
            >
              👤
              <h3>Profile</h3>
              <p>View & edit personal details</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/alerts/create")}
            >
              🚨
              <h3>Create Alert</h3>
              <p>Upload image & location</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/alerts/view")}
            >
              📢
              <h3>View Alerts</h3>
              <p>See active alerts</p>
            </div>

            <div className="dashboard-card">
              📊
              <h3>Analytics</h3>
              <p>Insights & trends</p>
            </div>

            <div className="dashboard-card">
              📞
              <h3>Emergency Numbers</h3>
              <p>Quick access</p>
            </div>

            <div className="dashboard-card placeholder">
              +
              <p>Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Public landing hero */
  return (
    <div className="landing">
      <div className="landing-card">
        <h1>Disaster Alert System</h1>
        <p>Real-time monitoring and alerts for critical situations</p>

        <div className="landing-buttons">
          <Link to="/register" className="btn primary">
            Get Started
          </Link>
          <Link to="/login" className="btn secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
