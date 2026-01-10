import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./../styles/alerts.css";

export default function ViewAlerts() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isAdmin, setIsAdmin] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "—";
    const d = new Date(dateValue);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setIsAdmin(data.isAdmin);
  };

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

  useEffect(() => {
    fetchAlerts();
    fetchProfile();
  }, []);

  return (
    <div className="alerts-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* 🔹 HEADER */}
      <div className="page-header">
        <h1 className="page-title">Active Alerts</h1>
        <p className="page-subtitle">Showing alerts from last 24 hours</p>
      </div>

      <div className="alerts-grid">
        {alerts.length === 0 && !error && <p>No alerts found</p>}

        {alerts.map((alert) => (
          <div key={alert._id} className="alert-card">
            {alert.imageUrl && (
              <img
                src={alert.imageUrl}
                alt="disaster"
                className="alert-image"
              />
            )}

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
            <p>
              <b>Date & Time:</b>{" "}
              {formatDateTime(alert.timestamp || alert.createdAt)}
            </p>

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(alert._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
