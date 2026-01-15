// components/analytics/ConfidenceBuckets.jsx
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

export default function ConfidenceBuckets() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const chartData = useMemo(() => {
    if (!data?.confidenceBuckets) return [];
    return data.confidenceBuckets.map((b) => ({
      bucket:
        typeof b._id === "number" ? `${b._id}-${b._id + 20}` : "Unknown",
      count: b.count,
    }));
  }, [data]);

  return (
    <AnalyticsLayout
      title="Confidence Buckets"
      subtitle="Distribution of AI confidence scores."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading graph...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsLayout>
  );
}
