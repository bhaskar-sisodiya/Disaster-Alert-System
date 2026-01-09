import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./../styles/alerts.css";

export default function ViewAlerts() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Not authenticated. Please login again.");
      setAlerts([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch alerts");
      }

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch alerts error:", err);
      setError(err.message);
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (alertId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this alert?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/alerts/${alertId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete alert");
      }

      fetchAlerts();
    } catch (err) {
      console.error("Delete alert error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="alerts-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* 🔹 HEADER */}
      <div className="page-header">
        <h1 className="page-title">Active Alerts</h1>
      </div>

      <div className="alerts-grid">
        {alerts.length === 0 && !error && <p>No alerts found</p>}

        {alerts.map((alert) => (
          <div key={alert._id} className="alert-card">
            <strong>{alert.type}</strong>

            <p>
              <b>Location:</b> {alert.location}
            </p>
            <p>
              <b>Severity:</b> {alert.severity}
            </p>
            <p>
              <b>Reason:</b> {alert.reason || "No reason provided"}
            </p>

            <button
              className="delete-btn"
              onClick={() => handleDelete(alert._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
