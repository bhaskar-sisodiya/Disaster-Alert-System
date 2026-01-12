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

export default function TypeDistribution() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useAnalyticsDashboard(range);

  const chartData = useMemo(() => {
    if (!data?.typeDistribution) return [];
    return data.typeDistribution.map((t) => ({
      name: t._id || "Unknown",
      value: t.count,
    }));
  }, [data]);

  return (
    <AnalyticsLayout
      title="Disaster Type Distribution"
      subtitle="Share of disaster types in selected range."
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
              innerRadius={90}   /* ✅ donut */
              outerRadius={140}
              paddingAngle={3}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} />
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
