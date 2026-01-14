import Alert from "../models/Alert.js";

export const fetchAnalyticsSummary = async ({ match, range }) => {
  const [
    totalAlerts,
    highSeverity,
    mostCommonTypeAgg,
    mostAffectedLocationAgg,
    avgConfidenceAgg,
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
  ]);

  return {
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
  };
};

export const fetchAlertsOverTime = async ({ match, range }) => {
  const points = await Alert.aggregate([
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

  return { range, points };
};

export const fetchTypeDistribution = async ({ match, range }) => {
  const data = await Alert.aggregate([
    { $match: match },
    { $group: { _id: "$type", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return { range, data };
};

export const fetchSeverityDistribution = async ({ match, range }) => {
  const data = await Alert.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $toLower: "$severity" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return { range, data };
};

export const fetchSeverityByType = async ({ match, range }) => {
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
  ]);

  return { range, data };
};

export const fetchTopLocations = async ({ match, range, limit = 8 }) => {
  const data = await Alert.aggregate([
    { $match: match },
    { $group: { _id: "$location", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

  return { range, data };
};

export const fetchConfidenceBuckets = async ({ match, range }) => {
  const data = await Alert.aggregate([
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
  ]);

  return { range, data };
};

export const fetchAnalyticsDashboard = async ({ match, range }) => {
  const [
    summary,
    alertsOverTime,
    typeDistribution,
    severityDistribution,
    severityByType,
    topLocations,
    confidenceBuckets,
  ] = await Promise.all([
    fetchAnalyticsSummary({ match, range }),
    fetchAlertsOverTime({ match, range }),
    fetchTypeDistribution({ match, range }),
    fetchSeverityDistribution({ match, range }),
    fetchSeverityByType({ match, range }),
    fetchTopLocations({ match, range, limit: 8 }),
    fetchConfidenceBuckets({ match, range }),
  ]);

  return {
    range,
    summary: {
      totalAlerts: summary.totalAlerts,
      highSeverity: summary.highSeverity,
      mostCommonType: summary.mostCommonType,
      mostAffectedLocation: summary.mostAffectedLocation,
      avgConfidence: summary.avgConfidence,
    },
    alertsOverTime: alertsOverTime.points,
    typeDistribution: typeDistribution.data,
    severityDistribution: severityDistribution.data,
    severityByType: severityByType.data,
    topLocations: topLocations.data,
    confidenceBuckets: confidenceBuckets.data,
  };
};
