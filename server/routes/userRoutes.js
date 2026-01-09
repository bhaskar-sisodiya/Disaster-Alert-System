// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getUserProfile);
router.put("/", protect, updateUserProfile);

export default router;
