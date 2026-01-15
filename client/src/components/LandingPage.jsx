// components/LandingPage.jsx
import "./../styles/landing.css";
import { Link, useNavigate } from "react-router-dom";
import LatestAlertNotification from "./LatestAlertNotification";

export default function LandingPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (token) {
    return (
      <div className="landing dashboard">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Welcome to Disaster Alert System</h1>
          <LatestAlertNotification />
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

            <div
              className="dashboard-card"
              onClick={() => navigate("/analytics")}
            >
              📊
              <h3>Analytics</h3>
              <p>Insights & trends</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/emergency")}
            >
              📞
              <h3>Emergency Numbers</h3>
              <p>Quick access</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/alerts/history")}
            >
              🕓
              <h3>Alert History</h3>
              <p>All alerts with pagination</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/alerts/map")}
            >
              🗺️
              <h3>Alerts Map</h3>
              <p>Pinpoint disasters on map</p>
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
