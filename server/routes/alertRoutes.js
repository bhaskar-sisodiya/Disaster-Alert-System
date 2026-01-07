// routes/alertRoutes.js

import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createAlert, getAlerts } from "../controllers/alertController.js";

const router = express.Router();

// Use memory storage so we can convert file buffer → base64
const upload = multer({ storage: multer.memoryStorage() });

// POST route now accepts file upload
router.post("/", protect, upload.single("image"), createAlert);

// GET route stays the same
router.get("/", protect, getAlerts);

export default router;