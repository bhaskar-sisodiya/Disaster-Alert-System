// routes/alertRoutes.js

import express from "express";
import multer from "multer";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createAlert,
  deleteAlert,
  getAlertsWithin1Day,
  getAlertsHistory,
  getAlertsForMap,
  updateAlertStatus,
  assignDmaToAlert,
} from "../controllers/alertController.js";

const router = express.Router();

// Use memory storage so we can convert file buffer → base64
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/alerts
 * Only operator/admin can create alert
 */
router.post(
  "/",
  protect,
  authorizeRoles("operator", "admin", "user"),
  upload.single("image"),
  createAlert
);

/**
 * GET /api/alerts
 */
router.get("/", protect, getAlertsWithin1Day);

/**
 * GET /api/alerts/history
 */
router.get("/history", protect, getAlertsHistory);

/**
 * PUT /api/alerts/:id/status
 * Only admin/operator can update status
 */
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "operator"),
  updateAlertStatus
);

/**
 * PUT /api/alerts/:id/assign-dma
 * Admin/operator/dma can assign dma
 */
router.put(
  "/:id/assign-dma",
  protect,
  authorizeRoles("admin", "operator", "dma"),
  assignDmaToAlert
);

/**
 * DELETE /api/alerts/:id
 * Admin + DMA can delete
 */
router.delete("/:id", protect, authorizeRoles("admin", "dma"), deleteAlert);

/**
 * GET /api/alerts/map
 */
router.get("/map", protect, getAlertsForMap);

export default router;
