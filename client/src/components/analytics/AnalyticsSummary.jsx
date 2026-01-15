// components/analytics/AnalyticsSummary.jsx
import { useState } from "react";
import AnalyticsLayout from "./AnalyticsLayout";
import StatusKpi from "./StatusKpi";
import DmaAssignmentKpi from "./DmaAssignmentKpi";
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

      {/* ✅ NEW KPIs */}
      {!isLoading && !error && data?.statusKpi && (
        <>
          <h2 style={{ marginTop: "2rem" }}>Status KPI</h2>
          <StatusKpi statusKpi={data.statusKpi} />
        </>
      )}

      {!isLoading && !error && data?.dmaAssignment && (
        <>
          <h2 style={{ marginTop: "2rem" }}>DMA Assignment KPI</h2>
          <DmaAssignmentKpi dmaAssignment={data.dmaAssignment} />
        </>
      )}
    </AnalyticsLayout>
  );
}
