// routes/alertRoutes.js

import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createAlert, deleteAlert, getAlertsWithin1Day, getAlertsHistory, getAlertsForMap } from "../controllers/alertController.js";

const router = express.Router();

// Use memory storage so we can convert file buffer → base64
const upload = multer({ storage: multer.memoryStorage() });

// POST route accepts file upload
router.post("/", protect, upload.single("image"), createAlert);

// GET route
router.get("/", protect, getAlertsWithin1Day);

// GET route
router.get("/history", protect, getAlertsHistory);

// DELETE route
router.delete("/:id", protect, deleteAlert);

router.get("/map", protect, getAlertsForMap);


export default router;