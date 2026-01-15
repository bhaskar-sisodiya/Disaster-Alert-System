// routes/emergencyNumberRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createEmergencyNumber,
  getAllEmergencyNumbers,
  getEmergencyByCategory,
} from "../controllers/emergencyNumberController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* Create emergency numbers */
router.post("/", protect, authorizeRoles("admin"), createEmergencyNumber);

/* View all emergency numbers */
router.get("/", protect, getAllEmergencyNumbers);

/* View emergency numbers by category */
router.get("/:category", protect, getEmergencyByCategory);

export default router;
