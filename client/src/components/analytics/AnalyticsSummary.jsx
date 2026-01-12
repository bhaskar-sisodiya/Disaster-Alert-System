import { useState } from "react";
import AnalyticsLayout from "./AnalyticsLayout";
import useAnalyticsDashboard from "../../hooks/useAnalyticsDashboard";
import "../../styles/analytics/analyticsCharts.css";

export default function AnalyticsSummary() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const summary = data?.summary;

  return (
    <AnalyticsLayout
      title="Analytics Summary"
      subtitle="Key performance indicators (KPIs) for disaster alerts."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading summary...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && summary && (
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Total Alerts</p>
            <h2 className="summary-value">{summary.totalAlerts}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">High Severity Alerts</p>
            <h2 className="summary-value">{summary.highSeverity}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Most Common Type</p>
            <h2 className="summary-value">{summary.mostCommonType}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Top Location</p>
            <h2 className="summary-value">{summary.mostAffectedLocation}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Avg Confidence</p>
            <h2 className="summary-value">
              {summary.avgConfidence !== null ? summary.avgConfidence : "—"}
            </h2>
          </div>
        </div>
      )}
    </AnalyticsLayout>
  );
}
