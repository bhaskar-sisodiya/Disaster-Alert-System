import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AnalyticsLayout from "./AnalyticsLayout";
import useAnalyticsDashboard from "../../hooks/useAnalyticsDashboard";
import "../../styles/analytics/analyticsCharts.css";

export default function TopLocations() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const chartData = useMemo(() => {
    if (!data?.topLocations) return [];
    return data.topLocations.map((l) => ({
      location: l._id || "Unknown",
      count: l.count,
    }));
  }, [data]);

  return (
    <AnalyticsLayout
      title="Top Locations"
      subtitle="Most affected locations in selected range."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading graph...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="location" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsLayout>
  );
}
