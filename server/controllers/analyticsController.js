// controllers/analyticsController.js

import { buildMatchQuery } from "../utils/analyticsUtils.js";

import {
  fetchStatusKpi,
  fetchDmaAssignmentKpi,
  fetchAnalyticsDashboard,
  fetchAnalyticsSummary,
  fetchAlertsOverTime,
  fetchTypeDistribution,
  fetchSeverityDistribution,
  fetchSeverityByType,
  fetchTopLocations,
  fetchConfidenceBuckets,
} from "../services/analyticsService.js";

/**
 * GET /api/analytics/status-kpi
 */
export const getStatusKpi = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchStatusKpi({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Status KPI error:", error);
    res.status(500).json({ message: "Failed to fetch status KPI" });
  }
};

/**
 * GET /api/analytics/dma-assignment
 */
export const getDmaAssignmentKpi = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchDmaAssignmentKpi({ match, range });
    res.json(data);
  } catch (error) {
    console.error("DMA Assignment KPI error:", error);
    res.status(500).json({ message: "Failed to fetch DMA assignment KPI" });
  }
};

/**
 * GET /api/analytics/summary
 */
export const getAnalyticsSummary = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const match = buildMatchQuery(range);

    const data = await fetchAnalyticsSummary({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ message: "Failed to load analytics summary" });
  }
};

/**
 * GET /api/analytics/alerts-over-time
 */
export const getAlertsOverTime = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const match = buildMatchQuery(range);

    const data = await fetchAlertsOverTime({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Alerts over time error:", error);
    res.status(500).json({ message: "Failed to fetch alerts over time" });
  }
};

/**
 * GET /api/analytics/type-distribution
 */
export const getTypeDistribution = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchTypeDistribution({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Type distribution error:", error);
    res.status(500).json({ message: "Failed to fetch type distribution" });
  }
};

/**
 * GET /api/analytics/severity-distribution
 */
export const getSeverityDistribution = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchSeverityDistribution({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Severity distribution error:", error);
    res.status(500).json({ message: "Failed to fetch severity distribution" });
  }
};

/**
 * GET /api/analytics/severity-by-type
 */
export const getSeverityByType = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchSeverityByType({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Severity by type error:", error);
    res.status(500).json({ message: "Failed to fetch severity by type" });
  }
};

/**
 * GET /api/analytics/top-locations?limit=8
 */
export const getTopLocations = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const limit = Number(req.query.limit) || 8;

    const data = await fetchTopLocations({ match, range, limit });
    res.json(data);
  } catch (error) {
    console.error("Top locations error:", error);
    res.status(500).json({ message: "Failed to fetch top locations" });
  }
};

/**
 * GET /api/analytics/confidence-buckets
 */
export const getConfidenceBuckets = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchConfidenceBuckets({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Confidence buckets error:", error);
    res.status(500).json({ message: "Failed to fetch confidence buckets" });
  }
};

/**
 * GET /api/analytics/dashboard
 */
export const getAnalyticsDashboard = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await fetchAnalyticsDashboard({ match, range });
    res.json(data);
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    res.status(500).json({ message: "Failed to load analytics dashboard" });
  }
};
