import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/analytics/analyticsHome.css";

export default function AnalyticsHome() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setIsAdmin(!!data.isAdmin);
      } catch (err) {
        console.error("Admin check failed:", err);
      }
    };

    fetchRole();
  }, []);

  const cards = [
    {
      title: "Summary",
      desc: "KPIs: total alerts, high severity, common type, top location.",
      path: "/analytics/summary",
      img: "/images/analytics-summary.jpg",
    },
    {
      title: "Alerts Over Time",
      desc: "Trend line chart of alerts over selected range.",
      path: "/analytics/alerts-over-time",
      img: "/images/analytics-trend.jpg",
    },
    {
      title: "Type Distribution",
      desc: "Share of disasters by type.",
      path: "/analytics/type-distribution",
      img: "/images/analytics-types.jpg",
    },
    {
      title: "Severity Distribution",
      desc: "Share of low / medium / high alerts.",
      path: "/analytics/severity-distribution",
      img: "/images/analytics-severity.jpg",
    },
    {
      title: "Severity by Type",
      desc: "Severity breakdown per disaster type.",
      path: "/analytics/severity-by-type",
      img: "/images/analytics-stacked.jpg",
    },
    {
      title: "Top Locations",
      desc: "Most affected locations.",
      path: "/analytics/top-locations",
      img: "/images/analytics-locations.jpg",
    },
    ...(isAdmin
      ? [
          {
            title: "AI Confidence (Admin)",
            desc: "Confidence histogram (debug metric).",
            path: "/analytics/confidence-buckets",
            img: "/images/analytics-confidence.jpg",
          },
        ]
      : []),
  ];

  return (
    <div className="analytics-home-page">
      {/* 🔙 Back button */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="analytics-home-header">
        <h1 className="analytics-home-title">Analytics</h1>
        <p className="analytics-home-subtitle">
          Choose a graph to explore insights.
        </p>
      </div>

      <div className="analytics-home-grid">
        {cards.map((c) => (
          <div
            key={c.path}
            className="analytics-home-card"
            onClick={() => navigate(c.path)}
          >
            <img
              src={c.img}
              alt={c.title}
              className="analytics-home-card-img"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="analytics-home-card-body">
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="analytics-home-link">View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
