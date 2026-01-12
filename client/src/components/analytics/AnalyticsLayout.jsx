import { useNavigate } from "react-router-dom";
import "../../../src/styles/analytics/analyticsCommon.css";

export default function AnalyticsLayout({
  title,
  subtitle,
  range,
  setRange,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="analytics-page">
      {/* Back */}
      <button className="page-back-btn" onClick={() => navigate("/analytics")}>
        ← Back
      </button>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}

        {/* Range selector */}
        <div className="analytics-controls">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="range-select"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">{children}</div>
    </div>
  );
}
