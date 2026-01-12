// controllers/alertController.js
import Alert from "../models/Alert.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { detectDisaster } from "../utils/geminiClient.js";
import { uploadAlertImage } from "../utils/uploadToSupabase.js";
import { normalizeLocationKey, toTitleCase } from "../utils/locationUtils.js";

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
      return res.status(400).json({
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
      return res.status(422).json({
        message: "No clear disaster detected. Alert not created.",
        raw: detection,
      });
    }

    // Debug logging
    console.log("Gemini detection raw:", detection);

    if (!detection || !detection.type || !detection.severity) {
      // Instead of failing hard, return a softer response
      return res
        .status(200)
        .json({ message: "No clear disaster detected", raw: detection });
    }

    const imageUrl = await uploadAlertImage(imageBuffer, mimeType);

    // Clean up location string (remove accidental quotes)
    const cleanLocation = toTitleCase(location || "Unknown");
    const locationKey = normalizeLocationKey(location || "Unknown");

    // Create alert document in MongoDB
    const alert = await Alert.create({
      type: detection.type,
      confidence: detection.confidence,
      severity: detection.severity,
      reason: detection.reason || "No reason provided",
      location: cleanLocation,
      locationKey,
      timestamp: new Date(),
      imageUrl,
    });

    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    const viewAlertsLink = `${CLIENT_URL}/alerts/view`;

    if (alert.type !== "Not a Disaster") {
      (async () => {
        try {
          const users = await User.find({
            email: { $exists: true, $ne: "" },
            locationKey: locationKey,
          }).select("email");

          for (const user of users) {
            await sendEmail({
              to: user.email,
              subject: `🚨 ${alert.type} Alert in ${alert.location}`,
              html: `
    <div style="font-family: Arial, sans-serif; padding: 15px;">
      <h2 style="color:#dc2626;">🚨 New Disaster Alert</h2>

      <p>
        A new <b>${alert.type}</b> alert has been detected in
        <b>${alert.location}</b>.
      </p>

      <p style="margin-top:10px;">
        Please visit our website to view full details and stay updated.
      </p>

      <a href="${viewAlertsLink}"
        style="
          display:inline-block;
          margin-top:12px;
          padding:10px 16px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        View Active Alerts →
      </a>

      ${
        alert.imageUrl
          ? `<div style="margin-top:18px;">
              <p><b>Image Preview:</b></p>
              <img src="${alert.imageUrl}"
                  alt="Alert Image"
                  style="max-width:100%; border-radius:10px; border:1px solid #ddd;" />
            </div>`
          : ""
      }

      <p style="margin-top:18px; color:#6b7280; font-size:0.9rem;">
        Stay safe,<br/>
        Disaster Alert System
      </p>
    </div>
  `,
            });
          }

          console.log("✅ Email notifications sent");
        } catch (err) {
          console.error("❌ Email notification error:", err.message);
        }
      })();
    }

    // TODO: Broadcast via Socket.IO here
    // io.emit("newAlert", alert);

    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts/history
 * Fetch all alerts (history)
 */
export const getAlertsHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const totalAlerts = await Alert.countDocuments();
    const totalPages = Math.ceil(totalAlerts / limit);

    const alerts = await Alert.find()
      .sort({ createdAt: -1 }) // ✅ newest first
      .skip(skip)
      .limit(limit);

    res.json({
      alerts,
      page,
      totalPages,
      totalAlerts,
      limit,
    });
  } catch (error) {
    console.error("Error fetching alert history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/alerts
 * Fetch ACTIVE alerts (last 24 hours only)
 */
export const getAlertsWithin1Day = async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const alerts = await Alert.find({
      createdAt: { $gte: last24Hours },
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    console.error("Error fetching active alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /api/alerts/:id
 * Delete a specific alert by ID
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid alert ID" });
    }

    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ message: "Alert deleted successfully", deletedAlert: alert });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
