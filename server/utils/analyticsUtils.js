// utils/analyticsUtils.js
/**
 * Helper: parse range query
 * allowed: 24h, 7d, 30d, 90d, all
 */
export const getStartDateFromRange = (range = "7d") => {
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

export const buildMatchQuery = (range) => {
  const startDate = getStartDateFromRange(range);
  return startDate ? { createdAt: { $gte: startDate } } : {};
};
