// controllers/alertController.js
import Alert from "../models/Alert.js";
import { detectDisaster } from "../utils/geminiClient.js";

/**
 * POST /api/alerts
 * Create a new alert from an uploaded image
 */
export const createAlert = async (req, res) => {
  try {
    const { location } = req.body;

    // Reject multiple uploads
    if (req.files && req.files.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one image can be uploaded at a time" });
    }

    const imageBuffer = req.file?.buffer;
    const mimeType = req.file?.mimetype; // e.g. "image/jpeg", "image/png", "image/webp"

    if (!imageBuffer) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Guard against unsupported formats
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!supportedTypes.includes(mimeType)) {
      return res
        .status(400)
        .json({
          message: `Unsupported format: ${mimeType}. Please upload JPEG, PNG, or WebP.`,
        });
    }

    // Convert buffer → base64 string
    const imageBase64 = imageBuffer.toString("base64");

    // Call Gemini API with base64 + mimeType
    const detection = await detectDisaster(imageBase64, mimeType);

    if (detection?.error === "QUOTA_EXCEEDED") {
      return res.status(429).json({ message: detection.message });
    }

    if (detection?.error === "API_ERROR") {
      return res.status(500).json({ message: detection.message });
    }

    if (!detection || !detection.type || !detection.severity) {
      return res
        .status(200)
        .json({ message: "No clear disaster detected", raw: detection });
    }

    // Debug logging
    console.log("Gemini detection raw:", detection);

    if (!detection || !detection.type || !detection.severity) {
      // Instead of failing hard, return a softer response
      return res
        .status(200)
        .json({ message: "No clear disaster detected", raw: detection });
    }

    // Clean up location string (remove accidental quotes)
    const cleanLocation = location?.replace(/^"|"$/g, "") || "Unknown";

    // Create alert document in MongoDB
    const alert = await Alert.create({
      type: detection.type,
      confidence: detection.confidence,
      severity: detection.severity,
      reason: detection.reason || "No reason provided",
      location: cleanLocation,
      timestamp: new Date(),
    });

    // TODO: Broadcast via Socket.IO here
    // io.emit("newAlert", alert);

    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts
 * Fetch all alerts
 */
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
