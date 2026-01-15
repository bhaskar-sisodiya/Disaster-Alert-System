// services/alertService.js
import Alert from "../models/Alert.js";

// import { detectDisaster } from "../utils/geminiClient.js";
import { detectDisaster } from "../utils/groqClient.js";
import { uploadAlertImage } from "../utils/uploadToSupabase.js";
import { normalizeLocationKey, toTitleCase } from "../utils/locationUtils.js";

export const createAlertFromImage = async ({ imageBuffer, mimeType, location, latNum, lngNum }) => {
  // Convert buffer → base64
  const imageBase64 = imageBuffer.toString("base64");

  // Detect using Gemini
  const detection = await detectDisaster(imageBase64, mimeType);

  if (detection?.error === "QUOTA_EXCEEDED") {
    return { ok: false, status: 429, message: detection.message };
  }

  if (detection?.error === "API_ERROR") {
    return { ok: false, status: 500, message: detection.message };
  }

  if (!detection || !detection.type || !detection.severity) {
    return {
      ok: false,
      status: 422,
      message: "No clear disaster detected. Alert not created.",
      raw: detection,
    };
  }

  // Upload to Supabase
  const imageUrl = await uploadAlertImage(imageBuffer, mimeType);

  // Location formatting
  const cleanLocation = toTitleCase(location || "Unknown");
  const locationKey = normalizeLocationKey(location || "Unknown");

  // Save in MongoDB
  const alert = await Alert.create({
    type: detection.type,
    confidence: detection.confidence,
    severity: detection.severity,
    reason: detection.reason || "No reason provided",
    location: cleanLocation,
    locationKey,
    timestamp: new Date(),
    imageUrl,
    lat: latNum,
    lng: lngNum,
  });

  return { ok: true, alert, locationKey };
};

export const getAlertHistoryPaginated = async ({ page = 1, limit = 8 }) => {
  const skip = (page - 1) * limit;

  const totalAlerts = await Alert.countDocuments();
  const totalPages = Math.ceil(totalAlerts / limit);

  const alerts = await Alert.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { alerts, page, totalPages, totalAlerts, limit };
};

export const getActiveAlertsLast24Hours = async () => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return Alert.find({
    createdAt: { $gte: last24Hours },
    lat: { $exists: true, $ne: null },
    lng: { $exists: true, $ne: null },
  }).sort({ createdAt: -1 });
};

export const getActiveAlertsForMap = async () => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return Alert.find({
    createdAt: { $gte: last24Hours },
    lat: { $exists: true, $ne: null },
    lng: { $exists: true, $ne: null },
  })
    .sort({ createdAt: -1 })
    .select("type severity location reason timestamp imageUrl lat lng createdAt");
};

export const deleteAlertById = async (id) => {
  return Alert.findByIdAndDelete(id);
};
