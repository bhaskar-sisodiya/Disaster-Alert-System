// hooks/useAnalyticsDashboard.js
import { useQuery } from "@tanstack/react-query";

export default function useAnalyticsDashboard(range) {
  const API_URL = import.meta.env.VITE_API_URL;

  return useQuery({
    queryKey: ["analytics-dashboard", range],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/analytics/dashboard?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load analytics");

      return json;
    },
    staleTime: 1000 * 60 * 5, // ✅ 5 min cached
    refetchOnWindowFocus: false,
  });
}
