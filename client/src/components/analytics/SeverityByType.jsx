import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import AnalyticsLayout from "./AnalyticsLayout";
import useAnalyticsDashboard from "../../hooks/useAnalyticsDashboard";
import "../../styles/analytics/analyticsCharts.css";

export default function SeverityByType() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const chartData = useMemo(() => {
    if (!data?.severityByType) return [];

    return data.severityByType.map((item) => {
      const row = { type: item._id, low: 0, medium: 0, high: 0 };

      item.severities.forEach((s) => {
        if (s.severity === "low") row.low = s.count;
        if (s.severity === "medium") row.medium = s.count;
        if (s.severity === "high") row.high = s.count;
      });

      return row;
    });
  }, [data]);

  return (
    <AnalyticsLayout
      title="Severity by Type"
      subtitle="Severity breakdown for each disaster type."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading graph...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="low" stackId="a" fill="#4CAF50" />{" "}
            {/* ✅ Green for low severity */}
            <Bar dataKey="medium" stackId="a" fill="#FFC107" />{" "}
            {/* ✅ Amber/Yellow for medium severity */}
            <Bar dataKey="high" stackId="a" fill="#F44336" />{" "}
            {/* ✅ Red for high severity */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsLayout>
  );
}
