// controllers/alertController.js

import {
  validateLatLng,
  validateMongoId,
  validateSingleFileUpload,
} from "../validators/alertValidator.js";

import {
  createAlertFromImage,
  deleteAlertById,
  getActiveAlertsForMap,
  getActiveAlertsLast24Hours,
  getAlertHistoryPaginated,
} from "../services/alertService.js";

import { notifyUsersAboutAlert } from "../services/notificationService.js";

/**
 * POST /api/alerts
 * Create a new alert from uploaded image
 */
export const createAlert = async (req, res) => {
  try {
    const { location, lat, lng } = req.body;

    const fileCheck = validateSingleFileUpload(req);
    if (!fileCheck.ok) {
      return res.status(fileCheck.status).json({ message: fileCheck.message });
    }

    const coordCheck = validateLatLng(lat, lng);
    if (!coordCheck.ok) {
      return res.status(coordCheck.status).json({ message: coordCheck.message });
    }

    const result = await createAlertFromImage({
      imageBuffer: fileCheck.imageBuffer,
      mimeType: fileCheck.mimeType,
      location,
      latNum: coordCheck.latNum,
      lngNum: coordCheck.lngNum,
    });

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ message: result.message, raw: result.raw });
    }

    // ✅ send email notifications (non-blocking)
    notifyUsersAboutAlert({
      alert: result.alert,
      locationKey: result.locationKey,
    }).catch((err) => console.error("❌ Email notification error:", err.message));

    res.status(201).json(result.alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts/history
 */
export const getAlertsHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const data = await getAlertHistoryPaginated({ page, limit });
    res.json(data);
  } catch (error) {
    console.error("Error fetching alert history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts
 */
export const getAlertsWithin1Day = async (req, res) => {
  try {
    const alerts = await getActiveAlertsLast24Hours();
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching active alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts/map
 */
export const getAlertsForMap = async (req, res) => {
  try {
    const alerts = await getActiveAlertsForMap();
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts for map:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /api/alerts/:id
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const idCheck = validateMongoId(id);
    if (!idCheck.ok) {
      return res.status(idCheck.status).json({ message: idCheck.message });
    }

    const alert = await deleteAlertById(id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ message: "Alert deleted successfully", deletedAlert: alert });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
