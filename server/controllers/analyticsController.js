import Alert from "../models/Alert.js";

/**
 * Helper: parse range query
 * allowed: 24h, 7d, 30d, 90d, all
 */
const getStartDateFromRange = (range = "7d") => {
  const now = Date.now();

  switch (range) {
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now - 90 * 24 * 60 * 60 * 1000);
    case "all":
      return null;
    default:
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
  }
};

const buildMatchQuery = (range) => {
  const startDate = getStartDateFromRange(range);
  return startDate ? { createdAt: { $gte: startDate } } : {};
};

/**
 * GET /api/analytics/summary
 */
export const getAnalyticsSummary = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const match = buildMatchQuery(range);

    // total alerts
    const totalAlertsPromise = Alert.countDocuments(match);

    // high severity count
    const highSeverityPromise = Alert.countDocuments({
      ...match,
      severity: { $regex: /^high$/i },
    });

    // most common type
    const mostCommonTypePromise = Alert.aggregate([
      { $match: match },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // most affected location
    const mostAffectedLocationPromise = Alert.aggregate([
      { $match: match },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // avg confidence
    const avgConfidencePromise = Alert.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
        },
      },
    ]);

    const [
      totalAlerts,
      highSeverity,
      mostCommonTypeAgg,
      mostAffectedLocationAgg,
      avgConfidenceAgg,
    ] = await Promise.all([
      totalAlertsPromise,
      highSeverityPromise,
      mostCommonTypePromise,
      mostAffectedLocationPromise,
      avgConfidencePromise,
    ]);

    res.json({
      range,
      totalAlerts,
      highSeverity,
      mostCommonType: mostCommonTypeAgg?.[0]?._id || "—",
      mostCommonTypeCount: mostCommonTypeAgg?.[0]?.count || 0,
      mostAffectedLocation: mostAffectedLocationAgg?.[0]?._id || "—",
      mostAffectedLocationCount: mostAffectedLocationAgg?.[0]?.count || 0,
      avgConfidence: avgConfidenceAgg?.[0]?.avgConfidence
        ? Number(avgConfidenceAgg[0].avgConfidence.toFixed(2))
        : null,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ message: "Failed to load analytics summary" });
  }
};

/**
 * GET /api/analytics/alerts-over-time
 * returns daily counts
 */
export const getAlertsOverTime = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const match = buildMatchQuery(range);

    const data = await Alert.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ range, points: data });
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

    const data = await Alert.aggregate([
      { $match: match },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ range, data });
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

    const data = await Alert.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $toLower: "$severity" }, // low/medium/high
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ range, data });
  } catch (error) {
    console.error("Severity distribution error:", error);
    res.status(500).json({ message: "Failed to fetch severity distribution" });
  }
};

/**
 * GET /api/analytics/severity-by-type
 * for stacked bar
 */
export const getSeverityByType = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const data = await Alert.aggregate([
      { $match: match },
      {
        $project: {
          type: 1,
          severity: { $toLower: "$severity" },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            severity: "$severity",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.type",
          severities: {
            $push: {
              severity: "$_id.severity",
              count: "$count",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ range, data });
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

    const data = await Alert.aggregate([
      { $match: match },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    res.json({ range, data });
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

    // Confidence expected 0-1 or 0-100? We'll handle both
    // If > 1 then assume it's percent, else assume fraction.
    const data = await Alert.aggregate([
      { $match: match },
      {
        $project: {
          confidence: 1,
          confidencePercent: {
            $cond: [
              { $gt: ["$confidence", 1] },
              "$confidence",
              { $multiply: ["$confidence", 100] },
            ],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$confidencePercent",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "Unknown",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.json({ range, data });
  } catch (error) {
    console.error("Confidence buckets error:", error);
    res.status(500).json({ message: "Failed to fetch confidence buckets" });
  }
};

export const getAnalyticsDashboard = async (req, res) => {
  try {
    const range = req.query.range || "30d";
    const match = buildMatchQuery(range);

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalAlerts,
      highSeverity,
      mostCommonTypeAgg,
      mostAffectedLocationAgg,
      avgConfidenceAgg,
      alertsOverTime,
      typeDistribution,
      severityDistribution,
      severityByType,
      topLocations,
      confidenceBuckets,
    ] = await Promise.all([
      Alert.countDocuments(match),

      Alert.countDocuments({
        ...match,
        severity: { $regex: /^high$/i },
      }),

      Alert.aggregate([
        { $match: match },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      Alert.aggregate([
        { $match: match },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      Alert.aggregate([
        { $match: match },
        { $group: { _id: null, avgConfidence: { $avg: "$confidence" } } },
      ]),

      // alerts over time
      Alert.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
          },
        },
        { $sort: { date: 1 } },
      ]),

      // type distribution
      Alert.aggregate([
        { $match: match },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // severity distribution
      Alert.aggregate([
        { $match: match },
        { $group: { _id: { $toLower: "$severity" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // severity by type (stack)
      Alert.aggregate([
        { $match: match },
        { $project: { type: 1, severity: { $toLower: "$severity" } } },
        {
          $group: {
            _id: { type: "$type", severity: "$severity" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.type",
            severities: {
              $push: { severity: "$_id.severity", count: "$count" },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // top locations
      Alert.aggregate([
        { $match: match },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // confidence buckets
      Alert.aggregate([
        { $match: match },
        {
          $project: {
            confidencePercent: {
              $cond: [
                { $gt: ["$confidence", 1] },
                "$confidence",
                { $multiply: ["$confidence", 100] },
              ],
            },
          },
        },
        {
          $bucket: {
            groupBy: "$confidencePercent",
            boundaries: [0, 20, 40, 60, 80, 101],
            default: "Unknown",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
    ]);

    res.json({
      range,
      summary: {
        totalAlerts,
        highSeverity,
        mostCommonType: mostCommonTypeAgg?.[0]?._id || "—",
        mostAffectedLocation: mostAffectedLocationAgg?.[0]?._id || "—",
        avgConfidence: avgConfidenceAgg?.[0]?.avgConfidence
          ? Number(avgConfidenceAgg[0].avgConfidence.toFixed(2))
          : null,
      },
      alertsOverTime,
      typeDistribution,
      severityDistribution,
      severityByType,
      topLocations,
      confidenceBuckets,
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    res.status(500).json({ message: "Failed to load analytics dashboard" });
  }
};
