// routes/adminRoutes.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getAllUsers, updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

/**
 * PUT /api/admin/users/:id/role
 * Only Admin can change user roles
 */
router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

export default router;
