// components/analytics/SeverityDistribution.jsx
import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import AnalyticsLayout from "./AnalyticsLayout";
import useAnalyticsDashboard from "../../hooks/useAnalyticsDashboard";
import "../../styles/analytics/analyticsCharts.css";

export default function SeverityDistribution() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const chartData = useMemo(() => {
    if (!data?.severityDistribution) return [];
    return data.severityDistribution.map((s) => ({
      name: (s._id || "unknown").toUpperCase(),
      value: s.count,
    }));
  }, [data]);

  return (
    <AnalyticsLayout
      title="Severity Distribution"
      subtitle="Share of low / medium / high alerts."
      range={range}
      setRange={setRange}
    >
      {isLoading && <p className="info-text">Loading chart...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    {
                      LOW: "#4CAF50", // ✅ Green for low severity
                      MEDIUM: "#FFC107", // ✅ Amber/Yellow for medium severity
                      HIGH: "#F44336", // ✅ Red for high severity
                    }[entry.name] || "#607D8B" // fallback professional blue-gray
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </AnalyticsLayout>
  );
}
