// components/analytics/AlertsOverTime.jsx
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AnalyticsLayout from "./AnalyticsLayout";
import useAnalyticsDashboard from "../../hooks/useAnalyticsDashboard";
import "../../styles/analytics/analyticsCharts.css";

export default function AlertsOverTime() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const points = useMemo(() => {
    if (!data?.alertsOverTime) return [];
    return data.alertsOverTime.map((p) => ({
      date: new Date(p.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      alerts: p.count,
    }));
  }, [data]);

  return (
    <AnalyticsLayout
      title="Alerts Over Time"
      subtitle="Trend of alerts across selected time range."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading graph...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="alerts" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </AnalyticsLayout>
  );
}
