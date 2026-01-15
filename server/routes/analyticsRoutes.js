// routes/analyticsRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getStatusKpi,
  getDmaAssignmentKpi,
  getAnalyticsSummary,
  getAlertsOverTime,
  getTypeDistribution,
  getSeverityDistribution,
  getSeverityByType,
  getTopLocations,
  getConfidenceBuckets,
  getAnalyticsDashboard,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", protect, getAnalyticsSummary);
router.get("/status-kpi", protect, getStatusKpi);
router.get("/dma-assignment", protect, getDmaAssignmentKpi);
router.get("/dashboard", protect, getAnalyticsDashboard);
router.get("/alerts-over-time", protect, getAlertsOverTime);
router.get("/type-distribution", protect, getTypeDistribution);
router.get("/severity-distribution", protect, getSeverityDistribution);
router.get("/severity-by-type", protect, getSeverityByType);
router.get("/top-locations", protect, getTopLocations);
router.get("/confidence-buckets", protect, getConfidenceBuckets);

export default router;
