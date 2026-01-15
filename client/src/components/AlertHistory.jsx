// components/AlertHistory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/alerthistory.css";

export default function AlertHistory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 8; // ✅ alerts per page
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
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

  const fetchHistory = async (currentPage) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const res = await fetch(
        `${API_URL}/alerts/history?page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch alert history");

      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="alerts-page">
      {/* Back */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Alert History</h1>
        <p className="page-subtitle">
          Showing all the created alerts till now.
        </p>
      </div>

      {loading && <p className="info-text">Loading alert history...</p>}
      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && alerts.length === 0 && (
        <p className="info-text">No alerts found in history.</p>
      )}

      {/* List */}
      {!loading && !error && alerts.length > 0 && (
        <div className="history-list">
          {alerts.map((alert) => {
            const expanded = expandedId === alert._id;

            return (
              <div key={alert._id} className="history-item">
                {/* Clickable row */}
                <div
                  className="history-row"
                  onClick={() => toggleExpand(alert._id)}
                >
                  <div className="history-main">
                    <h3 className="history-title">
                      {alert.type} <span>in</span> {alert.location}
                    </h3>
                    <p className="history-time">
                      {formatDateTime(alert.timestamp || alert.createdAt)}
                    </p>
                  </div>

                  <div className="history-expand">
                    {expanded ? "▲" : "▼"}
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="history-details">
                    {alert.imageUrl && (
                      <img
                        src={alert.imageUrl}
                        alt="alert"
                        className="alert-image"
                      />
                    )}

                    <p><b>Severity:</b> {alert.severity}</p>
                    <p><b>Confidence:</b> {alert.confidence ?? "—"}</p>
                    <p><b>Reason:</b> {alert.reason || "No reason provided"}</p>

                    <p>
                      <b>Date & Time:</b>{" "}
                      {formatDateTime(alert.timestamp || alert.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>

          <span className="page-count">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
