// routes/weatherRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", protect, getWeather);

export default router;
