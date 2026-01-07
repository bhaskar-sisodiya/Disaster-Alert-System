import { useEffect, useState } from "react";
import "./../styles/alerts.css";

export default function Alerts() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [alerts, setAlerts] = useState([]);   // MUST stay array
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH ALERTS ---------------- */
  const fetchAlerts = async () => {
    const token = localStorage.getItem("token");

    // 🔴 HARD GUARD
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

      // ✅ Ensure array
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch alerts error:", err);
      setError(err.message);
      setAlerts([]); // NEVER allow non-array
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  /* ---------------- CREATE ALERT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload an image");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("location", location);
      formData.append("image", image); // ✅ MUST match multer

      const res = await fetch(`${API_URL}/alerts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create alert");
      }

      // Reset form
      setLocation("");
      setImage(null);

      // Refresh list
      fetchAlerts();
    } catch (err) {
      console.error("Create alert error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alerts-page">
      <h2>🚨 Create Alert</h2>

      <form className="alert-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Alert"}
        </button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>📢 Active Alerts</h2>

      <div className="alerts-grid">
        {alerts.length === 0 && !error && <p>No alerts found</p>}

        {Array.isArray(alerts) &&
          alerts.map((alert) => (
            <div key={alert._id} className="alert-card">
              <strong>{alert.type}</strong>
              <p><b>Location:</b> {alert.location}</p>
              <p><b>Severity:</b> {alert.severity}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
